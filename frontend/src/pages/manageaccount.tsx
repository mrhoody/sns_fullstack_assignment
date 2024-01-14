import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import CustomNavBar from "@/components/CustomNavBar";

const ManageAccountPage: React.FC = () => {
  return (
    <Container>
      <CustomNavBar />
      <h2>Manage My Account</h2>
      <Stack gap={5}>
        <Form>
          <Row>
            <Form.Group className="mb-3" controlId="formRegisterUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" disabled />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" disabled />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" placeholder="Phone Number" />
            </Form.Group>
          </Row>

          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Update My Account
              </Button>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col>
            <h4>Had enough?</h4>
            <Button variant="danger" type="submit">
              Delete Account
            </Button>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
};

export default ManageAccountPage;
