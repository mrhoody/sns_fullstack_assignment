import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import CustomNavBar from "@/components/CustomNavBar";
import { postEndpointHelper } from "../../endpoint_utils";

const ManageAccountPage: React.FC = () => {
  const [updateEnabledState, setUpdateEnabledState] = useState<boolean>(false);
  const [nameState, setNameState] = useState<string>("");
  const [phoneNumberState, setPhoneNumberState] = useState<string>("");
  const [passwordState, setPasswordState] = useState<string>("");

  useEffect(() => {
    if (nameState.length === 0 || phoneNumberState.length === 0) {
      setUpdateEnabledState(false);
    } else {
      setUpdateEnabledState(true);
    }
  }, [nameState, phoneNumberState]);

  async function handleAccountUpdate() {
    const resp = await postEndpointHelper("login", {
      password: passwordState,
      name: nameState,
      phone_number: phoneNumberState,
    });
    const resp_json = await resp.json();
    console.log(resp_json);
  }

  return (
    <Container>
      <CustomNavBar />
      <h2>Manage My Account</h2>
      <Stack gap={5}>
        <Form>
          <Row>
            <Form.Group className="mb-3" controlId="formUpdateUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" disabled />
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
                  // login logic here
                  console.log("Update button clicked!");
                  console.log("Name: " + nameState);
                  console.log("Phone Number: " + phoneNumberState);
                  handleAccountUpdate();
                }}
              >
                Update My Account
              </Button>
            </Col>
            <Col>
              <p className="text-end">
                <a href="/me">Take me home.</a>
              </p>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col>
            <h4>Had enough?</h4>
            <Button variant="danger" type="submit" href="/">
              Delete Account & Data
            </Button>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
};

export default ManageAccountPage;
