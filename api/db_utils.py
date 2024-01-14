from fastapi import status
import psycopg2
import mutagen
import os
import typing


def handle_fetch_from_db(query: str):
    connection = psycopg2.connect(
        user="postgres",
        password="INSERT_PASSWORD_HERE",
        host="0.0.0.0",
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
        password="INSERT_PASSWORD_HERE",
        host="0.0.0.0",
        options="-c search_path=sns_db",
    )

    cursor = connection.cursor()

    cursor.execute(query)

    connection.commit()
    connection.close()
    return None


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


# testing user handlers
# handle_db_update("""SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));""")
# handle_create_account("mrhoody", "password", "Hud", "1234567890")
# print(TEST_fetch_all_users())

# handle_update_account("Hudson", "0987654321", 2)
# print(TEST_fetch_all_users())

# handle_delete_account(2)
# print(TEST_fetch_all_users()

# %%
import mutagen


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


# %%


with open("file_example_MP3_1MG.mp3", "rb") as f:
    print(mutagen.File(f, easy=True).info.length)

# %%
