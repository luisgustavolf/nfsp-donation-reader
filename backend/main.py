from typing import Optional, Union
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.extractor import get_nfe_number_from_base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


class ReadCuponBody(BaseModel):
    base64_image: str

@app.post("/read_cupon/")
async def read_cupon(body: ReadCuponBody):
    result = get_nfe_number_from_base64(body.base64_image)
    return {"code": result}
