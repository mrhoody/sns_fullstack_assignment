import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";
import { postEndpointHelper } from "../utils/endpoint-utils";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const [registerEnabledState, setRegisterEnabledState] =
    useState<boolean>(false);
  const [usernameState, setUsernameState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [nameState, setNameState] = useState<string>("");
  const [phoneNumberState, setPhoneNumberState] = useState<string>("");

  useEffect(() => {
    if (
      usernameState.length === 0 ||
      passwordState.length === 0 ||
      nameState.length === 0 ||
      phoneNumberState.length === 0
    ) {
      setRegisterEnabledState(false);
    } else {
      setRegisterEnabledState(true);
    }
  }, [usernameState, passwordState, nameState, phoneNumberState]);

  async function handleRegister() {
    const resp = await postEndpointHelper("create-account", {
      username: usernameState,
      password: passwordState,
      name: nameState,
      phone_number: phoneNumberState,
    });
    const resp_json = await resp?.json();
    if (resp_json.status_code !== 200) {
      throw alert(
        `Status code ${resp_json.status_code}: ${resp_json.message} `
      );
    } else {
      window.location.href = "/login";
      throw alert(resp_json.message);
    }
  }

  return (
    <Container>
      <h2>Register</h2>
      <Form>
        <Row>
          <Form.Group className="mb-3" controlId="formRegisterUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => {
                setUsernameState(e.target.value);
              }}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPasswordState(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setNameState(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisterPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Phone Number"
              onChange={(e) => {
                setPhoneNumberState(e.target.value);
              }}
            />
          </Form.Group>
          <Col>
            <Button
              variant="primary"
              type="button"
              disabled={!registerEnabledState}
              onClick={() => {
                // register logic here
                console.log("register button clicked");
                handleRegister();
              }}
            >
              Register
            </Button>
          </Col>

          <Col>
            <p className="text-end">
              Already a member? Log in <Link href="/login">here.</Link>
            </p>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default RegisterPage;
