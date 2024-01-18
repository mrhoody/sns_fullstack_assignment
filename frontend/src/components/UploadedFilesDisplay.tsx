import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { postEndpointHelper } from "../utils/endpoint-utils";
import { Col, Row } from "react-bootstrap";
import { getCookie } from "cookies-next";

interface UploadedFilesInfo {
  file_name: string;
  file_path: string;
  file_type: string;
  file_category: string;
  file_description: string;
  file_duration: string;
  file_upload_date: string;
  file_sample_rate: string;
  file_size: string;
}

interface UploadFileDisplayProps {
  uploaded_files?: UploadedFilesInfo[];
}

const UploadedFilesDisplay: React.FC<UploadFileDisplayProps> = (props) => {
  const [files, setFiles] = useState<UploadedFilesInfo[]>(
    props.uploaded_files ? props.uploaded_files : []
  );

  async function handleRetrieveFiles() {
    const response = await postEndpointHelper("view-audio-files", {
      user_id: getCookie("userId"),
    });
    const response_json = await response.json();
    if (response_json.status_code !== 200) {
      throw alert(
        `Status code ${response_json.status_code}: ${response_json.message}`
      );
    } else {
      setFiles(response_json.audio_files);
      console.log(response_json.audio_files);
    }
  }

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
              <th>File Duration</th>
              <th>File Upload Date</th>
              <th>File Sample Rate</th>
              <th>File Size</th>
            </tr>
          </thead>
          {files.length === 0 && (
            <tr>
              <td colSpan={9}>
                <center>
                  <u>
                    No files uploaded! Click the button to retrieve your files
                    if you have uploaded some.
                  </u>
                </center>
              </td>
            </tr>
          )}
          {files.map((file) => (
            <tr>
              <td>{file.file_name}</td>
              <td>{file.file_type}</td>
              <td>{file.file_category}</td>
              <td>{file.file_description}</td>
              <td>{file.file_duration}</td>
              <td>{file.file_upload_date}</td>
              <td>{file.file_sample_rate}</td>
              <td>{file.file_size}</td>
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
