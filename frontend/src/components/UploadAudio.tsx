import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UploadAudio: React.FC = () => {
  return (
    <Form>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload your audio files here.</Form.Label>
        <Form.Control type="file" />
      </Form.Group>

      <Form.Group controlId="formAudioDescription" className="mb-3">
        <Form.Label>Audio Description</Form.Label>
        <Form.Control type="text" placeholder="Description of Your File" />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>

      <Form.Group controlId="formAudioDescription" className="mb-3">
        <Form.Label>Audio Category</Form.Label>
        <Form.Select>
          <option value="music">Music</option>
          <option value="voicenote">Voice Note</option>
          <option value="others">Others</option>
        </Form.Select>
      </Form.Group>

      <Row>
        <Col>
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UploadAudio;
