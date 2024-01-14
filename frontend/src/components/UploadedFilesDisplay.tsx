import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";

interface UploadedFilesInfo {
  file_name: string;
  file_path: string;
  file_type: string;
  file_duration: string;
  file_size: string;
}

function UploadedFilesDisplay({ files }: { files: UploadedFilesInfo[] }) {
  return (
    <ListGroup>
      {files.map((file) => (
        <ListGroup.Item>
          {file.file_name}, {file.file_size}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default UploadedFilesDisplay;
