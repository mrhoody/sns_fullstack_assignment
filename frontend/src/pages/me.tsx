import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";
import UploadedFilesDisplay from "@/components/UploadedFilesDisplay";
import CustomNavBar from "@/components/CustomNavBar";
import UploadAudio from "@/components/UploadAudio";
import UserCard from "@/components/UserCard";
import { useLayoutEffect, useState } from "react";
import ProtectedRoute from "@/components/VerifyLogin";
import Button from "react-bootstrap/Button";
import { CookieValueTypes, getCookie, setCookie } from "cookies-next";

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
  const [loggedIn, setLoggedIn] = useState<CookieValueTypes>("false");

  useLayoutEffect(() => {
    setCookie("loggedIn", "true");
    setLoggedIn(getCookie("loggedIn"));
  }, []);

  const [usernameState, setUsernameState] = useState<string>("Username123");
  const [nameState, setNameState] = useState<string>("Default Name");
  const [phoneNumberState, setPhoneNumberState] = useState<string>("123456");

  return loggedIn === "true" ? (
    <Container>
      <CustomNavBar />
      <h2>Welcome, {nameState}!</h2>
      <Stack gap={5}>
        <Row>
          <Col>
            <h4>More About Me</h4>
            <UserCard
              username={usernameState}
              name={nameState}
              phoneNumber={phoneNumberState}
            />
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
            <UploadedFilesDisplay />
          </Col>
        </Row>

        <Row>
          <Col>
            <CustomAudioPlayer />
          </Col>
        </Row>
      </Stack>
      <Button onClick={() => {}}>LMAOOO</Button>
    </Container>
  ) : (
    <Container>
      <ProtectedRoute />
    </Container>
  );
};

export default MyAccountPage;
