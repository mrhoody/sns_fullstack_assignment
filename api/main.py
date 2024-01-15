import os
from typing import Annotated
from fastapi import FastAPI, File, Form, UploadFile, status
from db_utils import handle_fetch_from_db, handle_db_update, get_audio_metadata
from db_utils import (
    LoginModel,
    CreateAccountModel,
    UpdateAccountModel,
    DeleteAccountModel,
    UploadAudioModel,
    ViewAudioFilesModel,
    PlaybackAudioModel,
)

app = FastAPI()

audio_file_path = os.path.join(os.getcwd(), "audio_files")


@app.get("/")
def root():
    return {"message": "Hi Hud!", "status_code": status.HTTP_200_OK}


@app.post("/login")
def handle_login(user_info: LoginModel):
    query = f"""SELECT * FROM users WHERE username = '{user_info.username}';"""
    query_results = handle_fetch_from_db(query)
    # check if user exists
    if len(query_results) == 0:
        return {
            "message": "This user does not exist!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }
    # check if password is correct
    elif query_results[0][2] != user_info.password:
        return {
            "message": "Incorrect password!",
            "status_code": status.HTTP_401_UNAUTHORIZED,
        }
    # successful login
    else:
        return {"message": "You have logged in!", "status_code": status.HTTP_200_OK}


@app.post("/create-account")
def handle_create_account(user_info: CreateAccountModel):
    # check for duplicate usernames
    user_check_query_results = handle_fetch_from_db(
        f"""SELECT username FROM users WHERE username = '{user_info.username}';"""
    )
    if len(user_check_query_results) > 0:
        return {
            "message": "This username is already taken!",
            "status_code": status.HTTP_409_CONFLICT,
        }

    # insert new user into database
    query = f"""INSERT INTO users (username, password, name, phone_number)
            VALUES ('{user_info.username}', '{user_info.password}', '{user_info.name}', '{user_info.phone_number}');"""
    handle_db_update(query)
    return {
        "message": "Account created successfully!",
        "status_code": status.HTTP_201_CREATED,
    }


@app.post("/update-account")
def handle_update_account(new_user_info: UpdateAccountModel):
    query = f"""UPDATE users
            SET password = '{new_user_info.new_password}', name = '{new_user_info.new_name}', phone_number = '{new_user_info.new_phone_number}'
            WHERE id = '{new_user_info.user_id}';"""
    handle_db_update(query)
    return {
        "message": "Account updated successfully!",
        "status_code": status.HTTP_200_OK,
    }


@app.post("/delete-account")
def handle_delete_account(user_info: DeleteAccountModel):
    # admin exception
    if user_info.user_id == "1":
        return {
            "message": "You cannot delete the admin account!",
            "status_code": status.HTTP_403_FORBIDDEN,
        }

    # check if user exists in the first place
    else:
        user_check_query_results = handle_fetch_from_db(
            f"""SELECT username FROM users WHERE id = '{user_info.user_id}';"""
        )
        if len(user_check_query_results) == 0:
            return {
                "message": "This user does not exist!",
                "status_code": status.HTTP_404_NOT_FOUND,
            }

        # delete user from database
        query = f"""DELETE FROM users
                WHERE id = '{user_info.user_id}';"""
        handle_db_update(query)
    return {
        "message": "Account deleted successfully!",
        "status_code": status.HTTP_200_OK,
    }


@app.post("/upload-audio-file")
def handle_upload_audio(
    # not implemented using BaseModel as it is a file upload
    # formdata and file uploads cannot be used with BaseModel
    user_id: Annotated[str, Form(...)],
    audio_file: Annotated[UploadFile, File(...)],
):
    # check if filename already exists
    file_check_query_results = handle_fetch_from_db(
        f"""SELECT file_name FROM audio_files WHERE file_name = '{audio_file.filename}';"""
    )
    if len(file_check_query_results) > 0:
        return {
            "message": "This filename is already taken, please use another!",
            "status_code": status.HTTP_409_CONFLICT,
        }

    # check if file is valide audio and if so, get audio metadata
    file_metadata = get_audio_metadata(audio_file.file)
    if file_metadata == None:
        return {
            "message": "This file is not a valid audio file!",
            "status_code": status.HTTP_400_BAD_REQUEST,
        }
    # unpack metadata as we know it is not None
    file_duration, file_bitrate, file_sample_rate = file_metadata

    # write audio file to disk/volume
    file_path = os.path.join(audio_file_path, audio_file.filename)
    with open(file_path, "wb+") as audio_file_on_disk:
        audio_file_on_disk.write(audio_file.file.read())

    # get other file metadata
    file_size = os.path.getsize(file_path)  # reads file size in bytes
    file_type = audio_file.filename.split(".")[-1]

    # insert new audio file metadata into database
    query = f"""INSERT INTO audio_files (user_id, file_name, file_path, file_type, file_duration, file_bitrate, file_sample_rate, file_size)
            VALUES ('{user_id}', '{audio_file.filename}', '{file_path}', '{file_type}', '{file_duration}', '{file_bitrate}', '{file_sample_rate}', '{file_size}');"""
    handle_db_update(query)

    return {
        "message": "Audio file uploaded successfully!",
        "status_code": status.HTTP_201_CREATED,
        "audio_file": {
            "file_name": audio_file.filename,
            "file_path": file_path,
            "file_type": file_type,
            "file_duration": file_duration,
            "file_bitrate": file_bitrate,
            "file_sample_rate": file_sample_rate,
            "file_size": file_size,
        },
    }


@app.post("/view-audio-files")
def handle_view_audio_files(user_id: str):
    query = f"""SELECT * FROM audio_files
            WHERE user_id = '{user_id}';"""
    query_results = handle_fetch_from_db(query)
    # TODO: check if user exists?

    if len(query_results) == 0:
        return {
            "message": "You have no audio files!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }
    else:
        return {
            "message": "Audio files retrieved successfully!",
            "status_code": status.HTTP_200_OK,
            "audio_files": query_results,
        }


@app.get("/playback-audio-file")
def playback_audio(audio_id: str):
    # TODO: finish this
    # check if audio file exists
    query = f"""SELECT * FROM audio_files
            WHERE audio_id = '{audio_id}';"""
    query_results = handle_fetch_from_db(query)

    if len(query_results) == 0:
        return {
            "message": "That audio file doesn't exist!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }

    with open(query_results[0][3], "rb") as audio_file:
        audio_file_bytes = audio_file.read()

    return {
        "message": "Audio file retrieved successfully!",
        "status_code": status.HTTP_200_OK,
        "audio_file": audio_file_bytes,
    }
