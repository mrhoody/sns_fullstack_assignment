import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import UploadedFilesDisplay from "@/components/UploadedFilesDisplay";
import CustomNavBar from "@/components/CustomNavBar";
import UploadAudio from "@/components/UploadAudio";

const files = [
  {
    file_name: "file1",
    file_path: "path1",
    file_type: "type1",
    file_duration: "duration1",
    file_size: "size1",
  },
  {
    file_name: "file2",
    file_path: "path2",
    file_type: "type2",
    file_duration: "duration2",
    file_size: "size2",
  },
];
const MyAccountPage: React.FC = () => {
  return (
    <Container>
      <CustomNavBar />
      <h2>Welcome, Hud!</h2>
      <Stack gap={5}>
        <Row>
          <Col>
            <h4>My Account</h4>
            <a href="/manageaccount">Manage My Account</a>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Upload Audio</h4>
            <UploadAudio />
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>My Audio</h4>
            <UploadedFilesDisplay files={files} />
          </Col>
        </Row>

        <Row>
          <Col>
            <CustomAudioPlayer />
          </Col>
        </Row>
      </Stack>
    </Container>
  );
};

export default MyAccountPage;
