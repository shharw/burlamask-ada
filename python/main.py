import cv2
from fastapi import FastAPI, UploadFile
from fastapi.responses import HTMLResponse, FileResponse

from image_processing import swap_face


app = FastAPI()


def save_uploaded_file(file):
    file_name = file.filename
    file_path = f"/app/{file_name}"
    # file_path = f"{file_name}"

    with open(file_path, "wb") as f:
        f.write(file.file.read())


@app.post("/uploadfiles/")
async def create_upload_file(files: list[UploadFile]):
    location = "/app/"
    # location = ""
    for file in files:
        save_uploaded_file(file)

    images_list = [f"{location}{file.filename}" for file in files]
    swapped_img = swap_face(*images_list)
    path_to_swapped_img = f"{location}result_image.jpg"
    cv2.imwrite(path_to_swapped_img, swapped_img)

    return FileResponse(path_to_swapped_img, media_type="image/jpeg")


@app.get("/")
async def main():
    content = "<h1>Hello world!</h1>"
    return HTMLResponse(content=content)
