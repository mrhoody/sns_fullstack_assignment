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
import { useEffect, useLayoutEffect, useState } from "react";
import ProtectedRoute from "@/components/VerifyLogin";
import { CookieValueTypes, getCookie } from "cookies-next";
import { checkCookieExists } from "@/utils/cookie-utils";

const MyAccountPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<CookieValueTypes>("false");

  useLayoutEffect(() => {
    setLoggedIn(getCookie("loggedIn"));
  }, []);

  const [userNameState, setUserNameState] = useState<CookieValueTypes | string>(
    () =>
      checkCookieExists("userName") ? getCookie("userName") : "Default Username"
  );

  const [nameState, setNameState] = useState<CookieValueTypes | string>(() =>
    checkCookieExists("name") ? getCookie("name") : "Default Name"
  );
  const [phoneNumberState, setPhoneNumberState] = useState<
    CookieValueTypes | string
  >(
    checkCookieExists("phoneNumber")
      ? getCookie("phoneNumber")
      : "Default Phone Number"
  );
  const [selectedAudioFileState, setSelectedAudioFileState] = useState<{
    name: string;
    url: string;
  }>({ name: "", url: "" });

  useEffect(() => {
    console.log(selectedAudioFileState);
  }, [selectedAudioFileState]);

  return loggedIn === "true" ? (
    <Container>
      <CustomNavBar />
      <h2>Welcome, {nameState}!</h2>
      <Stack gap={5}>
        <Row>
          <Col lg={{ span: 3 }}>
            <h4>My Profile</h4>
            <UserCard
              username={userNameState}
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
            <UploadedFilesDisplay
              selectedFileHandler={setSelectedAudioFileState}
              selectedFileState={selectedAudioFileState}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <CustomAudioPlayer fileDetails={selectedAudioFileState} />
          </Col>
        </Row>
      </Stack>
    </Container>
  ) : (
    <Container>
      <ProtectedRoute />
    </Container>
  );
};

export default MyAccountPage;
