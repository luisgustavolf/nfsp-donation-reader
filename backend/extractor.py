import base64
import pytesseract
import re
from io import BytesIO
from typing import BinaryIO
from PIL import Image, ImageFile


def get_nfe_number_from_file(file: BinaryIO):
    image = Image.open(fp=file)
    return get_nfe_number_from_image(image=image)


def get_nfe_number_from_base64(base64_image: str):
    image = Image.open(BytesIO(base64.b64decode(base64_image)))
    return get_nfe_number_from_image(image=image)


def get_nfe_number_from_image(image: ImageFile):
    extracted_text: str = pytesseract.image_to_string(image)

    pattern = r"(\d{4}\s){10}\d{4}"

    pattern_matches = re.search(pattern=pattern, string=extracted_text)

    if pattern_matches:
        return pattern_matches.group()
    else:
        None
