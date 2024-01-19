import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { postEndpointHelper } from "../utils/endpoint-utils";
import { Col, Row } from "react-bootstrap";
import { getCookie } from "cookies-next";

interface UploadedFilesInfo {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_category: string;
  file_description: string;
  file_duration: number;
  file_upload_date: string;
  file_sample_rate: string;
  file_size: number;
}

interface UploadFileDisplayProps {
  uploadedFiles?: UploadedFilesInfo[];
  // selectedFileHandler will feed the name, generated URL of the selected file to the CustomAudioPlayer component
  selectedFileHandler: Dispatch<SetStateAction<{ name: string; url: string }>>;
  selectedFileState?: { name: string; url: string };
}

const UploadedFilesDisplay: React.FC<UploadFileDisplayProps> = (props) => {
  const [files, setFiles] = useState<UploadedFilesInfo[]>(
    props.uploadedFiles ? props.uploadedFiles : []
  );
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  async function handleRetrieveFiles() {
    const response = await postEndpointHelper("view-audio-files", {
      user_id: getCookie("userId"),
    });
    const response_json = await response.json();
    if (response_json.status_code === 404) {
      // to avoid throwing an alert on page load
    } else if (response_json.status_code !== 200) {
      throw alert(
        `Status code ${response_json.status_code}: ${response_json.message}`
      );
    } else {
      setFiles(response_json.audio_files);
    }
  }

  async function handlePlaybackFiles() {
    const response = await postEndpointHelper("playback-audio-file", {
      audio_id: selectedFileId,
    });
    if (response.status === 200) {
      const url = window.URL.createObjectURL(await response.blob());
      props.selectedFileHandler({
        name: selectedFileName,
        url: url,
      });
      // const audio = new Audio(url);
      // audio.play();
    } else {
      throw alert("Error fetching error file from server audio file!");
    }
  }

  // loads files from the database on page load
  useLayoutEffect(() => {
    handleRetrieveFiles();
  }, []);

  // loads the selected file from the database
  // useEffect used to ensure change in id occurs first before fetching the file
  useEffect(() => {
    if (selectedFileId !== "") {
      handlePlaybackFiles();
    }
  }, [selectedFileId]);

  return (
    <>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File ID</th>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Category</th>
              <th>File Description</th>
              <th>File Duration (s)</th>
              <th>File Sample Rate (Hz)</th>
              <th>File Size (MB)</th>
            </tr>
          </thead>
          {files.length === 0 && (
            <tr>
              <td colSpan={9}>
                <center>
                  <u>
                    No files uploaded! Click the button to refresh & retrieve
                    your files if you have uploaded some.
                  </u>
                </center>
              </td>
            </tr>
          )}
          {files.map((file) => (
            <tr id={`${file.file_name}`}>
              <td>{file.id}</td>
              <td>{file.file_name}</td>
              <td>{file.file_type}</td>
              <td>{file.file_category}</td>
              <td>{file.file_description}</td>
              <td>{Number(file.file_duration).toFixed(1)}</td>
              <td>{file.file_sample_rate}</td>
              <td>{Number(file.file_size / 1000000).toFixed(2)}</td>
              <td>
                <center>
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedFileId(file.id);
                      setSelectedFileName(file.file_name);
                    }}
                  >
                    Click to Load Audio
                  </Button>
                </center>
              </td>
            </tr>
          ))}
        </Table>
      </Row>
      <Row>
        <Col>
          <Button
            type="button"
            onClick={() => {
              handleRetrieveFiles();
            }}
          >
            Retrieve/Refresh Audio
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default UploadedFilesDisplay;
