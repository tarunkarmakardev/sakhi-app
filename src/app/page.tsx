import { navigationUrls } from "@/config";
import SakhiAvatar from "@/features/sakhi-avatar";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex gap-12 items-center">
      <SakhiAvatar />
      <div>
        <div className="text-text-main text-4xl lg:text-6xl mb-9">
          నమస్తే, నేను సఖి
        </div>
        <div className="text-lg lg:text-3xl mb-9 text-primary-text">
          {`మీ బాధలను వినడానికి నేను మీ స్నేహితుడిని! 'ప్రారంభించు' నొక్కి, మిమ్మల్ని ఏది బాధపెడుతుందో చెప్పండి, 
          నేను మీకు సహాయం చేయడానికి నా వంతు కృషి చేస్తాను!`}
        </div>
        <GetStarted />
      </div>
    </div>
  );
}

function GetStarted() {
  return (
    <Link href={navigationUrls.record}>
      <button className="flex items-center gap-2 bg-primary text-on-primary font-medium px-6 py-2 rounded-4xl cursor-pointer hover:bg-primary/60">
        <FaPlay />
        ప్రారంభించండి
      </button>
    </Link>
  );
}
