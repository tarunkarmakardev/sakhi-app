"use client";
import "regenerator-runtime/runtime";
import {
  useWaveform,
  useSpeechRecognition,
} from "@/features/speech-recognition";
import { RxCross2, RxCheck } from "react-icons/rx";
import { avatarVideoUrls, navigationUrls } from "@/config";
import { useGlobalStore } from "@/features/global-store/context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SakhiVideoPlayer from "@/features/sakhi-avatar-video";
import { FaPlay } from "react-icons/fa";

export type FeedbackStepType = "START" | "LISTEN" | "FINISH";

const videoConfig = {
  START: { playbackTimings: { start: 0, end: 16 } },
  LISTEN: { playbackTimings: { start: 18, end: 21 } },
  FINISH: { playbackTimings: { start: 25, end: 34 } },
};

const steps = ["START", "LISTEN", "FINISH"];

export default function Page() {
  const [step, setStep] = useState<FeedbackStepType>("START");
  const [playing, setPlaying] = useState(false);
  const router = useRouter();
  const language = useGlobalStore((s) => s.language);
  const {
    waveformRef,
    start: startListeningWaveform,
    stop: stopWaveform,
  } = useWaveform();
  const {
    listening,
    transcript,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    language,
  });
  const nextStep = steps[steps.indexOf(step) + 1] as FeedbackStepType;

  return (
    <div className="grid grid-rows-[150px,_40px,_120px,_1fr,_44px] gap-2">
      <div className="flex flex-col gap-2 items-center mx-auto">
        <div className="sakhi-video h-[150px] w-[150px] border-2 border-primary rounded-full">
          <SakhiVideoPlayer
            playing={playing}
            src={avatarVideoUrls.baseUrl}
            onPlaybackEnded={async () => {
              if (nextStep === "LISTEN") {
                setStep("LISTEN");
                await startListeningWaveform();
                await startListening();
              }
              if (step === "FINISH") {
                await stopListening();
                await stopWaveform();
                setPlaying(false);
                router.push(navigationUrls.feedback);
              }
            }}
            playbackTimings={videoConfig[step].playbackTimings}
          />
        </div>
        <div
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-4xl w-max cursor-pointer"
          onClick={() => setPlaying(true)}
        >
          <FaPlay />
          Start
        </div>
      </div>
      <div ref={waveformRef} className="h-[128px]" />
      <SpeechBox
        transcript={transcript}
        listening={listening}
        onStop={stopListening}
        onSubmit={() => setStep("FINISH")}
      />
    </div>
  );
}

type SpeechBoxProps = {
  transcript: string;
  listening: boolean;
  onStop: () => Promise<void>;
  onSubmit: () => void;
};

function SpeechBox({
  listening,
  transcript,
  onStop,
  onSubmit,
}: SpeechBoxProps) {
  const router = useRouter();
  const setFeedback = useGlobalStore((s) => s.setFeedback);

  const renderText = () => {
    if (transcript) return transcript;
    if (listening) return "Listening...";
  };

  const handleCancel = async () => {
    await onStop();
    setFeedback("");
    router.push(navigationUrls.home);
  };

  const handleSubmit = async () => {
    await onStop();
    setFeedback(transcript);
    onSubmit();
  };
  return (
    <>
      <div className="text-primary-text h-[100px] overflow-auto">
        {renderText()}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleCancel}
          className="flex gap-2 text-primary border-1 border-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
        >
          <RxCross2 />
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex gap-2 text-on-primary bg-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
          disabled={!transcript}
        >
          <RxCheck />
          Submit
        </button>
      </div>
    </>
  );
}
