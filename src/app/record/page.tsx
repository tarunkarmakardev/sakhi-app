"use client";
import "regenerator-runtime/runtime";
import {
  useWaveform,
  useSpeechRecognition,
} from "@/features/speech-recognition";
import { RxCross2, RxCheck } from "react-icons/rx";
import { avatarVideoUrls, navigationUrls, videoConfig } from "@/config";
import { useGlobalStore } from "@/features/global-store/context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SakhiVideoPlayer from "@/features/sakhi-avatar-video";
import { FaPlay } from "react-icons/fa";

export type FeedbackStepType = "START" | "LISTEN" | "FINISH";

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

  const handleStop = async () => {
    await stopListening();
    await stopWaveform();
    setPlaying(false);
  };

  return (
    <div className="grid h-[calc(100vh-160px)] grid-rows-[auto_120px_1fr_auto] w-full">
      <div className="justify-self-center">
        <SakhiVideoPlayer
          playing={playing}
          src={avatarVideoUrls.baseUrl}
          onPlaybackEnded={async () => {
            if (nextStep === "LISTEN") {
              setStep("LISTEN");
              await startListening();
              await startListeningWaveform();
            }
          }}
          playbackTimings={videoConfig[step].playbackTimings}
        />
      </div>
      <div>
        <div ref={waveformRef} className="h-[128px]" />
      </div>
      <div>
        <SpeechBox transcript={transcript} listening={listening} />
      </div>
      <div>
        <Actions
          transcript={transcript}
          onCancel={async () => {
            await handleStop();
            router.push(navigationUrls.home);
          }}
          onSubmit={async () => {
            await handleStop();
            setStep("FINISH");
            router.push(navigationUrls.feedback);
          }}
          onStart={() => setPlaying(true)}
        />
      </div>
    </div>
  );
}

type SpeechBoxProps = {
  transcript: string;
  listening: boolean;
};

function SpeechBox({ listening, transcript }: SpeechBoxProps) {
  const renderText = () => {
    if (transcript) return transcript;
    if (listening) return "Listening...";
  };

  return (
    <>
      <div className="text-primary-text h-[100px] overflow-auto">
        {renderText()}
      </div>
    </>
  );
}

type ActionProps = {
  transcript: string;
  onCancel: () => Promise<void>;
  onSubmit: () => void;
  onStart?: () => void;
};

function Actions({ transcript, onCancel, onSubmit, onStart }: ActionProps) {
  const setFeedback = useGlobalStore((s) => s.setFeedback);

  const handleCancel = async () => {
    setFeedback("");
    onCancel();
  };

  const handleSubmit = async () => {
    setFeedback(transcript);
    onSubmit();
  };

  return (
    <div className="flex justify-between">
      <button
        onClick={handleCancel}
        className="flex gap-2 text-primary border-1 border-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
      >
        <RxCross2 />
        Cancel
      </button>
      <div className="flex gap-2 items-center">
        <div
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-4xl w-max cursor-pointer"
          onClick={onStart}
        >
          <FaPlay />
          Start
        </div>
        <button
          onClick={handleSubmit}
          className="flex gap-2 text-on-primary bg-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
          disabled={!transcript}
        >
          <RxCheck />
          Submit
        </button>
      </div>
    </div>
  );
}
