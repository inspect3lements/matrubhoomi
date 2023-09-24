import json
from turfpy.measurement import boolean_point_in_polygon, length, area
from geojson import Polygon, Point, LineString
from turfpy.misc import line_intersect
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

# Save the trained model to a file
model_filename = './model/rf_model.pkl'
model = joblib.load(model_filename)

def create_ggjson_file():
    data = []
    glis = {}
    with open('./data/glis_data/glis.json', 'r') as f:
        glis = json.load(f)

    with open('./data/input_data/boundary-polygon-lvl10.json', 'r') as f:
        ward = json.load(f)
    a = {}
    a['type'] = "geojson"
    a['name'] = "sector"
    a['geometry'] = ward['features']
    data.append(a)

    b = {}
    b['type'] = "json",
    b['name'] = "health_care_centers"
    with open('./data/input_data/health_care.json', 'r') as f:
        health_care = json.load(f)
    l=[]
    for i in health_care['data']:
        d = {}
        d['geometry'] = [float(i[6]), float(i[5])]
        d['properties'] = [i[0], i[1], i[7]]
        l.append(d)
    b['geometry'] = l
    data.append(b)

    c = {}
    c['type'] = "geojson"
    c['name'] = "public_transport"
    with open('./data/input_data/public-transport-point.geojson', 'r') as f:
        public_transport = json.load(f)
    c['geometry'] = public_transport['features']
    data.append(c)

    d = {}
    d['type'] = "geojson"
    d['name'] = "poi"
    with open('./data/input_data/poi_point.geojson', 'r', encoding="utf8") as f:
        poi = json.load(f)
    d['geometry'] = poi['features']
    data.append(d)

    e = {}
    e['type'] = "geojson"
    e['name'] = "roads"
    with open('./data/input_data/highway-line.geojson', 'r') as f:
        roads = json.load(f)
    e['geometry'] = roads['features']
    data.append(e)

    glis['features'] = data
    with open('./data.ggjson', 'w') as f:
        json.dump(glis, f)
    return glis

def area_of_ward(ward_file):
    json_data = {}
    ward = {}
    with open(ward_file, 'r') as f:
        ward = json.load(f)
    ward_poly = Polygon(ward['features'][0]['geometry']['coordinates'])
    ar = area(ward_poly)
    return ar
    

def get_number_of_health_centers(ward_wise_data,ward_file, health_centers):
    json_data = {}
    ward = {}
    with open(health_centers, 'r') as f:
        json_data = json.load(f)
    with open(ward_file, 'r') as f:
        ward = json.load(f)
    for i in ward['features']:
        ward_poly = Polygon(i['geometry']['coordinates'])
        count = 0
        for j in json_data['data']:
            point = Point([float(j[6]), float(j[5])])
            if boolean_point_in_polygon(point, ward_poly):
                count += 1
        ward_wise_data[i["properties"]['NAME'].replace(" ", "_")]["health_center"] =  count
    return ward_wise_data

def get_number_of_public_transport(ward_wise_data,ward_file, public_transport_file):
    json_data = {}
    ward = {}
    with open(public_transport_file, 'r') as f:
        json_data = json.load(f)
    with open(ward_file, 'r') as f:
        ward = json.load(f)
    for i in ward['features']:
        ward_poly = Polygon(i['geometry']['coordinates'])
        count = 0
        for j in json_data['features']:
            point = Point(j['geometry']['coordinates'])
            if boolean_point_in_polygon(point, ward_poly):
                count += 1
        ward_wise_data[i["properties"]['NAME'].replace(" ", "_")]["public_transport"] = count
    return ward_wise_data

def get_number_of_poi_point(ward_wise_data,ward_file, poi_file):
    json_data = {}
    ward = {}
    with open(poi_file, 'r', encoding="utf8") as f:
        json_data = json.load(f)
    with open(ward_file, 'r', encoding="utf8") as f:
        ward = json.load(f)
    for i in ward['features']:
        ward_poly = Polygon(i['geometry']['coordinates'])
        count = 0
        for j in json_data['features']:
            point = Point(j['geometry']['coordinates'])
            if boolean_point_in_polygon(point, ward_poly):
                count += 1
        ward_wise_data[i["properties"]['NAME'].replace(" ", "_")]["poi"] = count
    return ward_wise_data

def air_quality(ward_wise_data,air_quality_file):
    data = pd.read_csv(air_quality_file)
    data['Month -Year'] = pd.to_datetime(data['Month -Year'], format='%b-%y')
    data = data.sort_values(by='Month -Year')
    data.set_index('Month -Year', inplace=True)
    data.fillna(method='ffill', inplace=True)
    X = np.arange(len(data)).reshape(-1, 1)
    y = data[['Monthly mean/average concentration - PM2.5', 'Monthly mean concentration - NO2',
            'Monthly mean concentration - PM10', 'Monthly mean concentration - SO2',
            'Monthly mean concentration - O3']].dropna()
    model = LinearRegression()
    model.fit(X[:len(y)], y)
    user_input='Jan-21'
    prediction_month = pd.to_datetime(user_input, format='%b-%y')
    months_since_start = (prediction_month - data.index[0]).days // 30
    predicted_values = model.predict(np.array([[months_since_start]]))
    predicted_pm25, predicted_no2, predicted_pm10, predicted_so2, predicted_o3 = predicted_values[0]
    ward_wise_data['city']["predicted_pm25"] = predicted_pm25
    ward_wise_data['city']["predicted_no2"] = predicted_no2
    ward_wise_data['city']["predicted_pm10"] = predicted_pm10
    ward_wise_data['city']["predicted_so2"] = predicted_so2
    ward_wise_data['city']["predicted_o3"] = predicted_o3
    return ward_wise_data

def get_road_info(ward_wise_data,roads_file):
    json_data = {}
    road = {}
    with open(roads_file, 'r') as f:
        json_data = json.load(f)
    for i in json_data['features']:
        line = LineString(i['geometry']['coordinates'])
        property = i["properties"]['HIGHWAY']
        leng = length(line)
        if property == 'primary':
            ward_wise_data['city']['primary']['count'] += 1
            ward_wise_data['city']['primary']['total_length'] += leng
        elif property == 'secondary':
            ward_wise_data['city']['secondary']['count'] += 1
            ward_wise_data['city']['secondary']['total_length'] += leng
        elif property == 'tertiary':
            ward_wise_data['city']['tertiary']['count'] += 1
            ward_wise_data['city']['tertiary']['total_length'] += leng
        elif property == 'residential':
            ward_wise_data['city']['residential']['count'] += 1
            ward_wise_data['city']['residential']['total_length'] += leng
        elif property == 'unclassified':
            ward_wise_data['city']['unclassified']['count'] += 1
            ward_wise_data['city']['unclassified']['total_length'] += leng
        elif property == 'service':
            ward_wise_data['city']['service']['count'] += 1
            ward_wise_data['city']['service']['total_length'] += leng
        elif property == 'trunk':
            ward_wise_data['city']['trunk']['count'] += 1
            ward_wise_data['city']['trunk']['total_length'] += leng
        else:
            road[property] = 1
    return ward_wise_data

def get_model_prediction(ward_wise_data, ward_file):
    json_data = {}
    ward = {}
    with open(ward_file, 'r') as f:
        ward = json.load(f)
    for i in ward['features']:
        ward_poly = Polygon(i['geometry']['coordinates'])
        ar = area(ward_poly)
        input_df = pd.DataFrame([{'area':ar,'accessibility':5}])
        print(model.predict(input_df))
    return ward_wise_data

def create_json_file(ward_file):
    with open(ward_file, 'r') as f:
        ward = json.load(f)
    ward_wise_data = {}
    for i in ward['features']:
        data = {}
        data['health_center'] = 0
        data['public_transport'] = 0
        data['poi'] = 0
        
        ward_wise_data[i["properties"]['NAME'].replace(" ", "_")] = data
    city_data = {}
    city_data['predicted_pm25'] = 0
    city_data['predicted_no2'] = 0
    city_data['predicted_pm10'] = 0
    city_data['predicted_so2'] = 0
    city_data['predicted_o3'] = 0
    a = {}
    a['count'] = 0
    a['total_length'] = 0

    b = {}
    b['count'] = 0
    b['total_length'] = 0

    c = {}
    c['count'] = 0
    c['total_length'] = 0

    d = {}
    d['count'] = 0
    d['total_length'] = 0

    e = {}
    e['count'] = 0
    e['total_length'] = 0

    f = {}
    f['count'] = 0
    f['total_length'] = 0

    g = {}
    g['count'] = 0
    g['total_length'] = 0

    h = {}
    h['count'] = 0
    h['total_length'] = 0

    i = {}
    i['count'] = 0
    i['total_length'] = 0

    j = {}
    j['count'] = 0
    j['total_length'] = 0

    k = {}
    k['count'] = 0
    k['total_length'] = 0

    l = {}
    l['count'] = 0
    l['total_length'] = 0

    m = {}
    m['count'] = 0
    m['total_length'] = 0

    n = {}
    n['count'] = 0
    n['total_length'] = 0

    o = {}
    o['count'] = 0
    o['total_length'] = 0

    p = {}
    p['count'] = 0
    p['total_length'] = 0

    q = {}
    q['count'] = 0
    q['total_length'] = 0

    r = {}
    r['count'] = 0
    r['total_length'] = 0

    s = {}
    s['count'] = 0
    s['total_length'] = 0

    t = {}
    t['count'] = 0
    t['total_length'] = 0

    u = {}
    u['count'] = 0
    u['total_length'] = 0

    v = {}
    v['count'] = 0
    v['total_length'] = 0

    city_data['primary'] = a
    city_data['secondary'] = b
    city_data['tertiary'] = c
    city_data['residential'] = d
    city_data['unclassified'] = e
    city_data['service'] = f
    city_data['trunk'] = g
    city_data['footway'] = h
    city_data['tertiary_link'] = i
    city_data['living_street'] = j
    city_data['trunk_link'] = k
    city_data['secondary_link'] = l
    city_data['construction'] = m
    city_data['cycleway'] = n
    city_data['pedestrian'] = o
    city_data['track'] = p
    city_data['primary_link'] = q
    city_data['path'] = r
    city_data['bridleway'] = s
    city_data['steps'] = t
    city_data['proposed'] = u
    city_data['road'] = v
    ward_wise_data['city'] = city_data

    return ward_wise_data



if __name__ == "__main__":

    ward_data = create_json_file('./data/input_data/boundary-polygon-lvl10.json')
    create_ggjson_file()

    # ward_data = get_number_of_healh_centers(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/input_data/health_care.json')
    # ward_data = get_number_of_public_transport(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/input_data/public-transport-point.geojson')
    # ward_data = get_number_of_poi_point(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/input_data/poi_point.geojson')
    # ward_data = get_road_info(ward_data,'./data/input_data/highway-line.geojson')
    # ward_data = air_quality(ward_data,'./data/input_data/datafile.csv')
    get_model_prediction(ward_data, './data/input_data/boundary-polygon-lvl10.json')
    print(ward_data)
