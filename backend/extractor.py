from typing import BinaryIO
from PIL import Image
import pytesseract
import re


def get_nfe_number_from_image(file: BinaryIO):
    image = Image.open(fp=file)

    extracted_text: str = pytesseract.image_to_string(image)

    pattern = r"(\d{4}\s){10}\d{4}"

    pattern_matches = re.search(pattern=pattern, string=extracted_text)

    if pattern_matches:
        return pattern_matches.group()
    else:
        None
