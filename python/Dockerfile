FROM python:3.10

COPY requirements.txt ./requirements.txt

RUN apt-get update && apt-get install -y cmake

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 4000

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]

