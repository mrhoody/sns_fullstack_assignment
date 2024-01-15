from fastapi import status
import psycopg2
import mutagen
import os
import typing
from pydantic import BaseModel

# API & DATABASE FUNCTIONS


def handle_fetch_from_db(query: str):
    connection = psycopg2.connect(
        user="postgres",
        password="password",
        host="db",
        options="-c search_path=sns_db",
    )

    cursor = connection.cursor()

    cursor.execute(query)
    query_results = cursor.fetchall()

    connection.commit()
    connection.close()
    return query_results


def handle_db_update(query: str):
    connection = psycopg2.connect(
        user="postgres",
        password="password",
        host="db",
        options="-c search_path=sns_db",
    )

    cursor = connection.cursor()

    cursor.execute(query)

    connection.commit()
    connection.close()
    return None


def get_audio_metadata(file_path: str | bytes):
    """Returns the length, bitrate, and sample rate of an audio file.
    Returns None if the file is not an accepted audio format.
    Accepts either a file object or a filepath string.
    """

    file_metadata = mutagen.File(file_path, easy=True)

    # if file_metadata is None then Mutagen could not read the file
    # meaning it is not in an accepted audio format
    if file_metadata is None:
        return None
    else:
        return (
            file_metadata.info.length,  # duration
            file_metadata.info.bitrate,
            file_metadata.info.sample_rate,
        )


def TEST_fetch_all_users():
    query = """SELECT * FROM users;"""
    return handle_fetch_from_db(query)


def TEST_fetch_all_audio_files():
    query = """SELECT * FROM audio_files;"""
    return handle_fetch_from_db(query)


def handle_playback_audio(audio_id):
    query = f"""SELECT * FROM audio_files
            WHERE audio_id = '{audio_id}';"""
    if len(handle_fetch_from_db(query)) == 0:
        return {
            "message": "This audio file does not exist!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }

    return handle_fetch_from_db(query)


# REQUEST BODY MODELS


class LoginModel(BaseModel):
    username: str
    password: str


class CreateAccountModel(BaseModel):
    username: str
    password: str
    name: str
    phone_number: str


class UpdateAccountModel(BaseModel):
    user_id: str
    new_password: str
    new_name: str
    new_phone_number: str


class DeleteAccountModel(BaseModel):
    user_id: str


class UploadAudioModel(BaseModel):  # unused due to file upload limitations
    user_id: str


class ViewAudioFilesModel(BaseModel):
    user_id: str


class PlaybackAudioModel(BaseModel):
    audio_id: str
    # TODO: finish this model
