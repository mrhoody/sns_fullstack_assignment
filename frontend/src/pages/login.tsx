import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LoginPage: React.FC = () => {
  return (
    <Container>
      <h2>Login</h2>
      <Form>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="email" placeholder="Username" />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Row>

        <Row>
          <Col>
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </Col>

          <Col>
            <p className="text-end">
              Not a member? <a href="/register">Sign up here!</a>
            </p>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default LoginPage;
