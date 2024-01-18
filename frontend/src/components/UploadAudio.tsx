import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { postEndpointHelper } from "../utils/endpoint-utils";
import { getCookie } from "cookies-next";

const UploadAudio: React.FC = () => {
  const [uploadEnabledState, setUploadEnabledState] = useState<boolean>(false);
  const [audioDescriptionState, setAudioDescriptionState] =
    useState<string>("");
  const [audioCategoryState, setAudioCategoryState] = useState<string>("music");
  const [audioFileState, setAudioFileState] = useState<any>();

  useEffect(() => {
    if (
      audioDescriptionState.length === 0 ||
      audioCategoryState.length === 0 ||
      audioFileState === undefined
    ) {
      setUploadEnabledState(false);
    } else {
      setUploadEnabledState(true);
    }
  }, [audioDescriptionState, audioCategoryState, audioFileState]);

  async function handleAudioUpload() {
    const resp = await postEndpointHelper("upload-audio-file", {
      user_id: getCookie("userId"),
      file_description: audioDescriptionState,
      file_category: audioCategoryState,
      audio_file: audioFileState,
    });
    const resp_json = await resp.json();
    // 201 is the status code for successful creation of a resource
    if (resp_json.status_code !== 200) {
      throw alert(`Status code ${resp_json.status_code}: ${resp_json.message}`);
    } else {
      throw alert(resp_json.message);
    }
  }

  return (
    <Form>
      <Form.Group controlId="formUploadAudioFile" className="mb-3">
        <Form.Label>Upload your audio files here.</Form.Label>
        <Form.Control
          type="file"
          accept="audio/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files === null) {
              // negate possibility of files list being null
              return;
            }
            console.log(e.target.files[0]);
            setAudioFileState(e.target.files[0]);
          }}
        />
      </Form.Group>

      <Form.Group controlId="formUploadAudioDescription" className="mb-3">
        <Form.Label>Audio Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Description of Your File"
          onChange={(e) => {
            setAudioDescriptionState(e.target.value);
          }}
        />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>

      <Form.Group controlId="formUploadAudioCategory" className="mb-3">
        <Form.Label>Audio Category</Form.Label>
        <Form.Control
          as="select"
          onChange={(e) => {
            setAudioCategoryState(e.target.value);
          }}
        >
          <option value="music">Music</option>
          <option value="voicenote">Voice Note</option>
          <option value="noise">Noise</option>
          <option value="others">Others</option>
        </Form.Control>
      </Form.Group>

      <Row>
        <Col>
          <Button
            variant="primary"
            type="button"
            disabled={!uploadEnabledState}
            onClick={() => {
              handleAudioUpload();
            }}
          >
            Upload
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UploadAudio;
