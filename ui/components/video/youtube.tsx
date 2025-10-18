import dynamic from "next/dynamic";
import { InlineLoader } from "../loader";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: true,
  loading: () => <InlineLoader fill={true} />,
});

interface YoutubeVideoProps {
  url: string;
  controls?: boolean;
}

export default function YoutubeVideo({
  url,
  controls = true,
}: YoutubeVideoProps) {
  return (
    <ReactPlayer
      src={url}
      controls={controls}
      config={{
        youtube: {
          color: "white",
        },
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
