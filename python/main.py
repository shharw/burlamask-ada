import cv2
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.responses import HTMLResponse, FileResponse
from demo import swap_face

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


def save_uploaded_file(file):
    file_name = file.filename
    file_path = f"/app/data/{file_name}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())


@app.post("/uploadfiles/")
async def create_upload_file(files: list[UploadFile]):
    # img1, img2 = (file.file.read() for file in files)
    # print(len(files))
    # print(type(files[0].file.read()))
    # print(type(img1))
    # print(type(img2))
    for file in files:
        save_uploaded_file(file)
    images_lst = [f"/app/data/{file.filename}" for file in files]
    res = swap_face(images_lst[0], images_lst[1])
    # cv2.imshow("seamlessclone", res)
    cv2.imwrite("/app/data/res.jpg", res)
    #
    # print(type(res.tobytes()))

    # return {"filename": [file.filename for file in files],
    #         "type": [file.content_type for file in files]}
    return FileResponse("/app/data/res.jpg", media_type="image/jpeg")

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