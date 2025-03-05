"use client";
import "regenerator-runtime/runtime";
import {
  useMicrophoneWaveform,
  useSpeechRecognition,
} from "@/features/speech-recognition";
import SakhiAvatar from "@/features/sakhi-avatar";
import { RxCross2, RxCheck } from "react-icons/rx";
import Link from "next/link";
import { navigationUrls } from "@/config";
import { useFeedbackStore } from "@/features/feedback-store/context";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <SakhiAvatar
        containerProps={{
          className:
            "lg:h-[200px] lg:w-[200px] border-4 border-primary rounded-full mx-auto",
        }}
      />
      <AudioWaveform />
      <SpeechBox />
    </div>
  );
}

function SpeechBox() {
  const router = useRouter();
  const setFeedback = useFeedbackStore((s) => s.setFeedback);
  const { listening, transcript, finalTranscript, stop } = useSpeechRecognition(
    {
      runOnMount: true,
    }
  );

  const renderText = () => {
    if (transcript) return transcript;
    if (listening) return "Listening...";
  };

  const handleSubmit = () => {
    stop();
    setFeedback(finalTranscript);
    router.push(navigationUrls.feedback);
  };
  return (
    <>
      <div className="text-primary-text mt-4 mb-6">{renderText()}</div>
      <div className="flex justify-between">
        <Link href={navigationUrls.home}>
          <button className="flex gap-2 text-primary border-1 border-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center">
            <RxCross2 />
            Cancel
          </button>
        </Link>
        <button
          onClick={handleSubmit}
          className="flex gap-2 text-on-primary bg-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
          disabled={!finalTranscript}
        >
          <RxCheck />
          Submit
        </button>
      </div>
    </>
  );
}

function AudioWaveform() {
  const { waveformRef } = useMicrophoneWaveform({ runOnMount: true });
  return <div ref={waveformRef} className="h-[128px]" />;
}
