import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { deleteAllCookies } from "@/utils/cookie-utils";

const CustomNavBar: React.FC = () => {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <strong>Hud's Audio Management System</strong>
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-start">
          <Nav>
            <Nav.Link href="/me">Home</Nav.Link>
            <Nav.Link href="/manageaccount">Manage My Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Button
              href="/login"
              onClick={() => {
                deleteAllCookies();
              }}
            >
              Log Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavBar;
