import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { postEndpointHelper } from "../../endpoint_utils";
import { Col, Row } from "react-bootstrap";

interface UploadedFilesInfo {
  file_name: string;
  file_path: string;
  file_type: string;
  file_duration: string;
  file_size: string;
}

interface UploadFileDisplayProps {
  uploaded_files?: UploadedFilesInfo[];
}

const UploadedFilesDisplay: React.FC<UploadFileDisplayProps> = (props) => {
  const [files, setFiles] = useState<UploadedFilesInfo[]>(
    props.uploaded_files ? props.uploaded_files : []
  );

  async function handleRetrieveFiles(user_id: string) {
    const response = await postEndpointHelper("get-uploaded-files", {
      user_id: user_id,
    });
    const response_json = await response.json();
    console.log(response_json);
  }

  return (
    <>
      <Row>
        <Col>
          <ListGroup>
            {files.length === 0 && (
              <ListGroup.Item>No files uploaded.</ListGroup.Item>
            )}
            {files.map((file) => (
              <ListGroup.Item action>
                {file.file_name}, {file.file_size}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            type="button"
            onClick={() => {
              // TODO - get user_id from session
              handleRetrieveFiles("1");
            }}
          >
            Retrieve Audio
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default UploadedFilesDisplay;
