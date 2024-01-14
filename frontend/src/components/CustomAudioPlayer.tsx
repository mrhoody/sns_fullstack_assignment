import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomAudioPlayer = () => (
  <AudioPlayer
    autoPlay
    src="http://example.com/audio.mp3"
    onPlay={(e) => console.log("onPlay")}
    // other props here
  />
);

export default CustomAudioPlayer;
