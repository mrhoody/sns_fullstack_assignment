FROM python:3.11-alpine

WORKDIR /app

RUN mkdir audio_files

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . /app

