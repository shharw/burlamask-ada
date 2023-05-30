import cv2
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import HTMLResponse, FileResponse
from demo import swap_face
from itertools import permutations

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


def save_uploaded_file(file):
    file_name = file.filename
    file_path = f"/app/data/{file_name}"
    # file_path = f"{file_name}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())


@app.post("/uploadfiles/")
async def create_upload_file(files: list[UploadFile]):
    location = "/app/data/"
    # location = ""
    for file in files:
        save_uploaded_file(file)

    images_list = [f"{location}{file.filename}" for file in files]
    images_list = list(permutations([f"{location}{file.filename}" for file in files], 2))
    swapped_images = []
    for i, pair in enumerate(images_list, start=1):
        swapped_img = swap_face(*pair)
        path_to_swapped_img = f"{location}res_{i}.jpg"
        swapped_images.append(path_to_swapped_img)
        cv2.imwrite(path_to_swapped_img, swapped_img)

    # print(type(res.tobytes()))

    # return {"filename": [file.filename for file in files],
    #         "type": [file.content_type for file in files]}
    # return FileResponse(path_to_swapped_img, media_type="image/jpeg")
    file_responses = []
    for file in swapped_images:
        # Create a FileResponse object for each image
        file_responses.append(FileResponse(file, media_type="image/jpeg"))

        # Return the list of FileResponse objects
    return file_responses

@app.post("/upload_photo")
async def upload_photo(file: UploadFile):
    file_name = file.filename
    file_path = f"/app/data/{file_name}"  # Specify the directory where you want to save the photos
    print(file.content_type)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return {"message": "Photo uploaded successfully!"}


@app.get("/")
async def main():
    content = """
<body>
<form action="/files/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
<form action="/uploadfiles/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    """
    # Response(content=image_bytes, media_type="image/png")
    return HTMLResponse(content=content)