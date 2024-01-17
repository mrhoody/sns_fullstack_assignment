import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { postEndpointHelper } from "../../endpoint_utils";

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
    // const response = await postEndpointHelper("upload-audio", {
    //   audio_description: audioDescriptionState,
    //   audio_category: audioCategoryState,
    //   audio_file: audioFileState,
    // });
    // const response_json = await response.json();
    // console.log(response_json);
  }

  return (
    <Form>
      <Form.Group controlId="formUploadAudioFile" className="mb-3">
        <Form.Label>Upload your audio files here.</Form.Label>
        <Form.Control
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAudioFileState(e.target.files);
            console.log(e.target.files);
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
            console.log("e.target.value", e.target.value);
            setAudioCategoryState(e.target.value);
          }}
        >
          <option value="music">Music</option>
          <option value="voicenote">Voice Note</option>
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
