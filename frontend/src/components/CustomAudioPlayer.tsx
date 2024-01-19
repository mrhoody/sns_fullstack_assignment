import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

interface FileDetails {
  name: string;
  url: string;
}

interface CustomAudioPlayerProps {
  fileDetails: FileDetails;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = (props) => {
  const [audioPlayerHeaderState, setAudioPlayerHeaderState] = useState<string>(
    props.fileDetails.name === ""
      ? "No Audio File Selected"
      : props.fileDetails.name
  );
  const [audioPlayerSrcState, setAudioPlayerSrcState] = useState<string>(
    props.fileDetails.url === "" ? "" : props.fileDetails.url
  );

  useEffect(() => {
    setAudioPlayerHeaderState(props.fileDetails.name);
    setAudioPlayerSrcState(props.fileDetails.url);
  }, [props.fileDetails]);

  // test src link "http://webaudioapi.com/samples/audio-tag/chrono.mp3"

  return (
    <AudioPlayer
      src={audioPlayerSrcState}
      header={audioPlayerHeaderState}
      // other props here
    />
  );
};
export default CustomAudioPlayer;
