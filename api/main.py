import os
from typing import Annotated
from fastapi import FastAPI, File, Form, UploadFile, status
from fastapi.responses import FileResponse
from db_utils import handle_fetch_from_db, handle_db_update, get_audio_metadata
from fastapi.middleware.cors import CORSMiddleware

# allow CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://localhost:3000/login",
    "http://localhost:3000/create-account",
    "http://localhost:3000/update-account",
    "http://localhost:3000/delete-account",
    "http://localhost:3000/upload-audio-file",
    "http://localhost:3000/view-audio-files",
    "http://localhost:3000/playback-audio-file",
]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

audio_file_path = os.path.join(os.getcwd(), "audio_files")


@app.get("/")
async def root():
    return {"message": "Hi Hud!", "status_code": status.HTTP_200_OK}


@app.post("/login")
def handle_login(
    username: Annotated[str, Form(...)], password: Annotated[str, Form(...)]
):
    query = f"""SELECT * FROM users WHERE username = '{username}';"""
    query_results = handle_fetch_from_db(query)
    # check if user exists
    if len(query_results) == 0:
        return {
            "message": "This user does not exist!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }
    # check if password is correct
    elif query_results[0][2] != password:
        return {
            "message": "Incorrect password!",
            "status_code": status.HTTP_401_UNAUTHORIZED,
        }
    # successful login
    else:
        return {"message": "You have logged in!", "status_code": status.HTTP_200_OK}


@app.post("/create-account")
def handle_create_account(
    username: Annotated[str, Form(...)],
    password: Annotated[str, Form(...)],
    name: Annotated[str, Form(...)],
    phone_number: Annotated[str, Form(...)],
):
    # check for duplicate usernames
    user_check_query_results = handle_fetch_from_db(
        f"""SELECT username FROM users WHERE username = '{username}';"""
    )
    if len(user_check_query_results) > 0:
        return {
            "message": "This username is already taken!",
            "status_code": status.HTTP_409_CONFLICT,
        }

    # insert new user into database
    query = f"""INSERT INTO users (username, password, name, phone_number)
            VALUES ('{username}', '{password}', '{name}', '{phone_number}');"""
    handle_db_update(query)
    return {
        "message": "Account created successfully!",
        "status_code": status.HTTP_201_CREATED,
    }


@app.post("/update-account")
def handle_update_account(
    user_id: Annotated[str, Form(...)],
    new_password: Annotated[str, Form(...)],
    new_name: Annotated[str, Form(...)],
    new_phone_number: Annotated[str, Form(...)],
):
    query = f"""UPDATE users
            SET password = '{new_password}', name = '{new_name}', phone_number = '{new_phone_number}'
            WHERE id = '{user_id}';"""
    handle_db_update(query)
    return {
        "message": "Account updated successfully!",
        "status_code": status.HTTP_200_OK,
    }


@app.post("/delete-account")
def handle_delete_account(user_id: Annotated[str, Form(...)]):
    # admin exception
    if user_id == "1":
        return {
            "message": "You cannot delete the admin account!",
            "status_code": status.HTTP_403_FORBIDDEN,
        }

    # check if user exists in the first place
    else:
        user_check_query_results = handle_fetch_from_db(
            f"""SELECT username FROM users WHERE id = '{user_id}';"""
        )
        if len(user_check_query_results) == 0:
            return {
                "message": "This user does not exist!",
                "status_code": status.HTTP_404_NOT_FOUND,
            }

        # delete user's audio files from disk
        user_audio_files_query_results = handle_fetch_from_db(
            f"""SELECT file_path FROM audio_files WHERE user_id = '{user_id}';"""
        )
        for audio_file in user_audio_files_query_results:
            os.remove(audio_file[0])

        # delete user's audio files from database
        query = f"""DELETE FROM audio_files
                WHERE user_id = '{user_id}';"""
        handle_db_update(query)

        # delete user from database
        query = f"""DELETE FROM users
                WHERE id = '{user_id}';"""
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
    file_category: Annotated[str, Form(...)],
    file_description: Annotated[str, Form(...)],
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

    # check if file is valid audio and if so, get audio metadata
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
    query = f"""INSERT INTO audio_files (user_id, file_name, file_path, file_type, file_category, file_description, file_duration, file_bitrate, file_sample_rate, file_size)
            VALUES ('{user_id}', '{audio_file.filename}', '{file_path}', '{file_type}', '{file_category}', '{file_description}', '{file_duration}', '{file_bitrate}', '{file_sample_rate}', '{file_size}');"""
    handle_db_update(query)

    return {
        "message": "Audio file uploaded successfully!",
        "status_code": status.HTTP_201_CREATED,
        "file_data": {
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
def handle_view_audio_files(user_id: Annotated[str, Form(...)]):
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


@app.post("/playback-audio-file")
def playback_audio(audio_id: Annotated[str, Form(...)]):
    # TODO: finish this
    # check if audio file exists
    query = f"""SELECT * FROM audio_files
            WHERE id = '{audio_id}';"""
    query_results = handle_fetch_from_db(query)

    if len(query_results) == 0:
        return {
            "message": "That audio file doesn't exist!",
            "status_code": status.HTTP_404_NOT_FOUND,
        }

    # retrieve file from disk
    file_path = query_results[0][3]
    file_name = query_results[0][2]

    # if file exists, return FileResponse using filepath
    return FileResponse(file_path, headers={"filename": file_name})
