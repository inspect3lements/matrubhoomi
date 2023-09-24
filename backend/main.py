from llama_cpp import Llama
import uvicorn
from fastapi import FastAPI
import json
from util import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index():
   return {"app": "matru bhoomi", "status": "running"}

@app.get("/generate_ggjson")
async def index():
   gg = create_ggjson_file()
   return gg

@app.get("/get_analytics")
async def index():
    ward_data = json.dumps({})
    ward_data = create_json_file('./data/input_data/boundary-polygon-lvl10.json')
    ward_data = get_number_of_health_centers(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/health_care.json')
    ward_data = get_number_of_public_transport(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/public-transport-point.geojson')
    ward_data = get_number_of_poi_point(ward_data,'./data/input_data/boundary-polygon-lvl10.json', './data/poi_point.geojson')
    ward_data = get_road_info(ward_data,'./data/input_data/highway-line.geojson')
    ward_data = air_quality(ward_data,'./data/input_data/datafile.csv')
    print(ward_data)
    return ward_data

def generate_health_centers_report():
   health_care_data = json.dumps({})
   with open('./data/input_data/health_care.json') as json_file:
      health_care_data = json.load(json_file)
   number_of_health_care = len(health_care_data['data'])
   LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
   report_input = "generate a specific 800 words report called Health Centers Report with values for the corresponding json data and explaining each term carefully if total number of health care centers is" + str(number_of_health_care) + "in city with area of "+ str(area_of_ward("./data/input_data/land.geojson"))
   report = LLM(report_input)  
   report_text = report["choices"][0]["text"]
   return report_text

def generate_public_transport_report():
   public_transport = json.dumps({})
   with open('./data/input_data/public-transport-point.geojson') as json_file:
      public_transport = json.load(json_file)
   LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
   number_of_public = len(public_transport['features'])
   report_input = "generate a specific 800 words report called Public Transport Report with values for the corresponding json data and explaining each term carefully if the total public transport points in city are" + str(number_of_public) +"in city with area" + str(area_of_ward("./data/input_data/land.geojson"))
   report = LLM(report_input)  
   report_text = report["choices"][0]["text"]
   return report_text

def generate_poi_point_report():
   public_transport = json.dumps({})
   with open('./data/input_data/poi_point.geojson', encoding="utf8") as json_file:
      public_transport = json.load(json_file)
   LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
   number_of_public = len(public_transport['features'])
   report_input = "generate a specific 800 words report called POI Point Report with values explaining each term carefully if the total point of attraction in the city are" + str(number_of_public)+ "in city with area" + str(area_of_ward("./data/input_data/land.geojson"))
   report = LLM(report_input)  
   report_text = report["choices"][0]["text"]
   return report_text

def generate_environmental_analysis():
   data = pd.read_csv('./data/input_data/datafile.csv')
   LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
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
   report_input = "generate a specific 800 words report called Environment Analysis Report with values explaining each term carefully Monthly mean/average concentration - PM2.5: "+ str(predicted_pm25) + "Monthly mean concentration - NO2: " +str(predicted_no2) + "Monthly mean concentration - PM10: " + str(predicted_pm10) + "Monthly mean concentration - SO2: " + str(predicted_so2) + "Monthly mean concentration - O3: " + str(predicted_o3)
   print(report_input)
   report = LLM(report_input)  
   report_text = report["choices"][0]["text"]
   return report_text

@app.get("/generate_report")
async def generate_report():
   environmental_analysis = generate_environmental_analysis()
   health_centers_report = generate_health_centers_report()
   public_transport_report = generate_public_transport_report()
   poi_point_report = generate_poi_point_report()

   # Consolidate the reports into a single report
   consolidated_report = f"""Environmental Analysis Report:

         Health Centers Report:
         {health_centers_report}

         Public Transport Report:
         {public_transport_report}

         POI Point Report:
         {poi_point_report}

         Air Quality Report:
         {environmental_analysis}
"""

   return {"report": consolidated_report}

@app.get("/chatbot")
async def index(inp: str = ''):
    LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
    i = "you are a chatbot named bhoomi chat and your task is to assist them only with queries on urban planning in india. Do not generate a response if the question is unrelated to urban planning,city development, infrastructure, transportation, zoning regulations, sustainable design, and community engagement. return a answer with max 150 words . Q: "+inp+" A: "
    ans = LLM(i)
    return ans["choices"][0]
if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
