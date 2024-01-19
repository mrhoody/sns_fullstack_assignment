import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { postEndpointHelper } from "../utils/endpoint-utils";
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [loginEnabledState, setLoginEnabledState] = useState<boolean>(false);
  const [usernameState, setUsernameState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");

  useEffect(() => {
    if (usernameState.length === 0 || passwordState.length === 0) {
      setLoginEnabledState(false);
    } else {
      setLoginEnabledState(true);
    }
  }, [usernameState, passwordState]);

  async function handleLogin() {
    const resp = await postEndpointHelper("login", {
      username: usernameState,
      password: passwordState,
    });
    const resp_json = await resp?.json();
    if (resp_json.status_code !== 200) {
      throw alert(`Status code ${resp_json.status_code}: ${resp_json.message}`);
    } else {
      console.log(resp_json);
      setCookie("loggedIn", "true");
      setCookie("userName", resp_json.user_data.username);
      setCookie("name", resp_json.user_data.name);
      setCookie("phoneNumber", resp_json.user_data.phone_number);
      setCookie("userId", resp_json.user_data.user_id);
      window.location.href = "/me";
    }
  }

  return (
    <Container>
      <h2>Login</h2>
      <Form>
        <Row>
          <Form.Group className="mb-3" controlId="formLoginUsername">
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

          <Form.Group className="mb-3" controlId="formLoginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPasswordState(e.target.value);
              }}
            />
          </Form.Group>
          <Col>
            <Button
              variant="primary"
              type="button"
              disabled={!loginEnabledState}
              onClick={() => {
                // login logic here
                handleLogin();
              }}
            >
              Log In
            </Button>
          </Col>

          <Col>
            <p className="text-end">
              Not a member? <Link href="/register">Sign up here!</Link>
            </p>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default LoginPage;
