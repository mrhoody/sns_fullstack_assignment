import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

interface UserCardProps {
  username: string;
  name: string;
  phoneNumber: string;
}

const UserCard: React.FC<UserCardProps> = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.username}</Card.Title>
        <Card.Subtitle>My name: {props.name}</Card.Subtitle>
        <Card.Text>My phone number: {props.phoneNumber}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
