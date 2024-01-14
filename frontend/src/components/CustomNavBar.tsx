import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CustomNavBar() {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <strong>Hud's Audio Management System</strong>
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-start">
          <Nav>
            <Nav.Link href="/myaccount">Home</Nav.Link>
            <Nav.Link href="/manageaccount">Manage My Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Button>Log Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
