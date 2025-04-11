from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import pytesseract
import numpy as np
import re
import pandas as pd

pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

app = FastAPI()

origins = [
    "http://localhost", 
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:8001",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

pincodes = pd.read_csv('pincode.csv')

@app.post("/extract_aadhaar")
async def extract_aadhaar(file: UploadFile = File(...)):
    data = await file.read()
    nparr = np.frombuffer(data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang='eng')
    pattern = re.compile(r'\d{6}')
    lines = text.splitlines()
    last_match = None
    for line in lines:
        match = pattern.search(line.strip())
        if match:
            last_match = match
    if last_match:
        pincode = last_match.group().strip()
        state = pincodes[pincodes["Pincode"] == int(pincode)]["StateName"].values[0]
        print(state)
        return {"State": state, "Pincode": pincode}
    return {"Error": "No pattern found"}