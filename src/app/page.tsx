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
          Namaste, I am Sakhi
        </div>
        <div className="text-lg lg:text-3xl mb-9 text-primary-text">
          {`I'm your friend who is here to listen to your worries! Just tap
          'start' and tell me what’s bothering you, and I’ll do my best to help!`}
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
        Start
      </button>
    </Link>
  );
}
