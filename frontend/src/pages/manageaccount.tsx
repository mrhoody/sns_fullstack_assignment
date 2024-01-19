import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import CustomNavBar from "@/components/CustomNavBar";
import { postEndpointHelper } from "../utils/endpoint-utils";
import ProtectedRoute from "@/components/VerifyLogin";
import { getCookie, setCookie, CookieValueTypes } from "cookies-next";
import { deleteAllCookies } from "@/utils/cookie-utils";
import Link from "next/link";

const ManageAccountPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<CookieValueTypes>("false");

  useLayoutEffect(() => {
    setLoggedIn(getCookie("loggedIn"));
  }, []);

  const [updateEnabledState, setUpdateEnabledState] = useState<boolean>(false);
  const [nameState, setNameState] = useState<CookieValueTypes | string>("");
  const [phoneNumberState, setPhoneNumberState] = useState<
    CookieValueTypes | string
  >("");
  const [passwordState, setPasswordState] = useState<CookieValueTypes | string>(
    ""
  );

  useEffect(() => {
    if (nameState?.length === 0 || phoneNumberState?.length === 0) {
      setUpdateEnabledState(false);
    } else {
      setUpdateEnabledState(true);
    }
  }, [nameState, phoneNumberState]);

  async function handleAccountUpdate() {
    // hardcode error handling for now
    if (getCookie("userId") === undefined) {
      throw alert(
        `User ID is undefined! This means you have bypassed the login flow somehow. 
        This is an error that Hud couldn't quite fix in time, sorry.`
      );
    }

    const resp = await postEndpointHelper("update-account", {
      user_id: getCookie("userId"),
      new_password: passwordState,
      new_name: nameState,
      new_phone_number: phoneNumberState,
    });
    const resp_json = await resp?.json();
    if (resp_json.status_code !== 200) {
      throw alert(
        `Status code ${resp_json.status_code}: ${resp_json.message} `
      );
    } else {
      setCookie("name", resp_json.user_data.name);
      setCookie("phoneNumber", resp_json.user_data.phone_number);
      throw alert(resp_json.message);
    }
  }

  async function handleAccountDelete() {
    const resp = await postEndpointHelper("delete-account", {
      user_id: getCookie("userId"),
    });
    const resp_json = await resp?.json();
    if (resp_json.status_code !== 200) {
      alert(`Status code ${resp_json.status_code}: ${resp_json.message}`);
    } else {
      deleteAllCookies();
      window.location.href = "/login";
      alert(resp_json.message);
    }
  }

  return loggedIn === "true" ? (
    <Container>
      <CustomNavBar />
      <h2>Manage My Account</h2>
      <Stack gap={5}>
        <Form>
          <Row>
            <Form.Group className="mb-3" controlId="formUpdateUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder={getCookie("userName")}
                disabled
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUpdatePassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your New Password"
                onChange={(e) => setPasswordState(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUpdateName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your New Name"
                onChange={(e) => {
                  setNameState(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUpdatePhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Your New Phone Number"
                onChange={(e) => {
                  setPhoneNumberState(e.target.value);
                }}
              />
            </Form.Group>
          </Row>

          <Row>
            <Col>
              <Button
                variant="primary"
                type="button"
                disabled={!updateEnabledState}
                onClick={() => {
                  handleAccountUpdate();
                }}
              >
                Update My Account
              </Button>
            </Col>
            <Col>
              <p className="text-end">
                <Link href="/me">Take me home.</Link>
              </p>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col>
            <h4>Had enough?</h4>
            <Button
              variant="danger"
              type="button"
              onClick={handleAccountDelete}
            >
              Delete Account & Data
            </Button>
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

export default ManageAccountPage;
