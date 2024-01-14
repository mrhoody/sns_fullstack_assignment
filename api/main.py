import os

from fastapi import FastAPI, File, UploadFile, status
from db_utils import handle_fetch_from_db, handle_db_update, get_audio_metadata

app = FastAPI()

audio_file_path = os.path.join(os.getcwd(), "audio_files")


@app.get("/")
def root():
    return {"message": "Hi Hud!", "status_code": status.HTTP_200_OK}


@app.post("/login")
def handle_login(username: str, password: str):
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
def handle_create_account(username: str, password: str, name: str, phone_number: str):
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
def handle_update_account(new_name: str, new_phone_number: str, user_id: str):
    query = f"""UPDATE users
            SET name = '{new_name}', phone_number = '{new_phone_number}'
            WHERE id = '{user_id}';"""
    handle_db_update(query)
    return {
        "message": "Account updated successfully!",
        "status_code": status.HTTP_200_OK,
    }


@app.post("/delete-account")
def handle_delete_account(user_id: str):
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
    user_id: str,
    file: UploadFile,
):
    # check if filename already exists
    file_check_query_results = handle_fetch_from_db(
        f"""SELECT file_name FROM audio_files WHERE file_name = '{file.filename}';"""
    )
    if len(file_check_query_results) > 0:
        return {
            "message": "This filename is already taken, please use another!",
            "status_code": status.HTTP_409_CONFLICT,
        }

    # check if file is valide audio and if so, get audio metadata
    file_metadata = get_audio_metadata(file.file)
    if file_metadata == None:
        return {
            "message": "This file is not a valid audio file!",
            "status_code": status.HTTP_400_BAD_REQUEST,
        }
    # unpack metadata as we know it is not None
    file_duration, file_bitrate, file_sample_rate = file_metadata

    # get other file metadata
    file_size = len(file)  # reads file size in bytes
    file_type = file.filename.split(".")[-1]

    # write audio file to disk/volume
    file_path = os.path.join(audio_file_path, file.filename)
    with open(file_path, "wb") as audio_file:
        audio_file.write(file.file.read())

    # insert new audio file metadata into database
    query = f"""INSERT INTO audio_files (user_id, file_name, file_path ,file_type, file_duration, file_bitrate, file_sample_rate, file_size)
            VALUES ('{user_id}', '{file.filename}', '{file_path}', {file_type}, {file_duration}, {file_bitrate}, {file_sample_rate}, {file_size});"""
    handle_db_update(query)

    return {
        "message": "Audio file uploaded successfully!",
        "status_code": status.HTTP_201_CREATED,
        "audio_file": {
            "file_name": file.filename,
            "file_path": file_path,
            "file_type": file_type,
            "file_duration": file_duration,
            "file_bitrate": file_bitrate,
            "file_sample_rate": file_sample_rate,
            "file_size": file_size,
        },
    }


@app.get("view-audio-files")
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
    return
