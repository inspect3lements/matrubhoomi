from llama_cpp import Llama
import uvicorn
from fastapi import FastAPI
import json
from util import *
app = FastAPI()

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
    ward_data = create_json_file('./data/boundary-polygon-lvl10.json')
    ward_data = get_number_of_healh_centers(ward_data,'./data/boundary-polygon-lvl10.json', './data/health_care.json')
    ward_data = get_number_of_public_transport(ward_data,'./data/boundary-polygon-lvl10.json', './data/public-transport-point.geojson')
    ward_data = get_number_of_poi_point(ward_data,'./data/boundary-polygon-lvl10.json', './data/poi_point.geojson')
    ward_data = get_road_info(ward_data,'./data/highway-line.geojson')
    ward_data = air_quality(ward_data,'./data/datafile.csv')
    print(ward_data)
    return ward_data


@app.get("/generate_report")
async def generate_report():
    ward_data = json.dumps({})
    ward_data = create_json_file('./data/boundary-polygon-lvl10.json')
    ward_data = air_quality(ward_data, './data/datafile.csv')
    LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
    report_input = "Environmental Analysis: " + json.dumps(ward_data)
    report = LLM(report_input, max_tokens=800)
    report_text = report["choices"][0]["text"]

    return {"report": report_text}

@app.get("/chatbot")
async def index(inp: str = ''):
    LLM = Llama(model_path=r".\model\llama-2-7b-chat.ggmlv3.q8_0.bin", f16_kv=True, n_gpu_layers=1)
    i = "you are a chatbot named bhoomi chat and your task is to assist them only with queries on urban planning in india. Do not generate a response if the question is unrelated to urban planning,city development, infrastructure, transportation, zoning regulations, sustainable design, and community engagement. return a answer with max 150 words . Q: "+inp+" A: "
    ans = LLM(i)
    return ans["choices"][0]
if __name__ == "__main__":
   uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
