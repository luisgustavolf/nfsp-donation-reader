from typing import Union
from fastapi import FastAPI, UploadFile
from backend.extractor import get_nfe_number_from_image

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/read_cupon/")
async def create_upload_file(file: UploadFile):
    result = get_nfe_number_from_image(file.file)
    return {"code": result}
