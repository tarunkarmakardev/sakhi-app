"use client";
import "regenerator-runtime/runtime";

import {
  useMediaWaveform,
  useMicWaveform,
  useSpeechRecognition,
} from "@/features/speech-recognition";
import { RxCross2, RxCheck } from "react-icons/rx";
import { audioUrls, navigationUrls } from "@/config";
import { useGlobalStore } from "@/features/global-store/context";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { cn } from "@/lib/classnames";
import { useParticles } from "@/features/particles";

export type FeedbackStepType = "START" | "LISTEN";

export default function Page() {
  const router = useRouter();
  const language = useGlobalStore((s) => s.language);
  const setAudioBlob = useGlobalStore((s) => s.setAudioBlob);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState<FeedbackStepType | null>(null);
  const particles = useParticles();
  const micWaveform = useMicWaveform({
    onRecordEnd: (data) => {
      setAudioBlob(data);
    },
  });
  const audioWaveform = useMediaWaveform({
    source: audioRef.current,
    onRender: (instance) => {
      particles.startAnimation(instance.getEnergy());
    },
  });
  const {
    listening,
    transcript,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    language,
  });

  const handleStart = async () => {
    if (audioRef.current) {
      await audioRef.current.play();
      audioRef.current.volume = 1;
    }
    setStep("START");
  };

  const handleStop = async () => {
    await stopListening();
    await audioWaveform.stop();
    await micWaveform.stop();
  };

  return (
    <div className="grid h-[calc(100vh-180px)] grid-rows-[minmax(200px,500px)_120px_100px_44px] w-full">
      <div className="place-self-center h-[150px]">
        <canvas ref={particles.canvasRef} width={200} height={200} />
        <audio
          crossOrigin="anonymous"
          ref={audioRef}
          src={audioUrls.start}
          controls={false}
          preload="auto"
          onEnded={async () => {
            await audioWaveform.stop();
            await startListening();
            await micWaveform.start();
            particles.reset();
            setStep("LISTEN");
          }}
        />
      </div>
      <div>
        <div
          ref={micWaveform.targetRef}
          className={cn("h-[128px]", { hidden: step !== "LISTEN" })}
        />
        <div
          ref={audioWaveform.targetRef}
          className={cn("h-[128px]", {
            hidden: step !== "START",
          })}
        />
        {step === null && <StartButton onStart={handleStart} />}
      </div>
      <div>
        <SpeechBox transcript={transcript} listening={listening} />
      </div>
      <div className="mt-auto">
        {step === "LISTEN" ? (
          <Actions
            transcript={transcript}
            onCancel={async () => {
              await handleStop();
              router.push(navigationUrls.home);
            }}
            onSubmit={async () => {
              await handleStop();
              router.push(navigationUrls.feedback);
            }}
          />
        ) : null}
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
};

function Actions({ transcript, onCancel, onSubmit }: ActionProps) {
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
        రద్దు చేయి
      </button>
      <div className="flex gap-2 items-center">
        <button
          onClick={handleSubmit}
          className="flex gap-2 text-on-primary bg-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
          disabled={!transcript}
        >
          <RxCheck />
          సమర్పించండి
        </button>
      </div>
    </div>
  );
}

type StartButtonProps = {
  onStart: () => void;
};

function StartButton({ onStart }: StartButtonProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-4xl w-max cursor-pointer"
        onClick={onStart}
      >
        <FaPlay />
        ప్రారంభించండి
      </div>
    </div>
  );
}
