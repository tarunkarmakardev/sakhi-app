"use client";
import {
  apiEndpoints,
  avatarVideoUrls,
  navigationUrls,
  videoConfig,
} from "@/config";
import { useGlobalStore } from "@/features/global-store/context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { RxCross2 } from "react-icons/rx";
import { FeedbackPostPayload,FeedbackAudioPostPayload } from "@/schemas/feedback";
import { useRouter } from "next/navigation";
import SakhiVideoPlayer from "@/features/sakhi-avatar-video";
import { useState } from "react";
import Loader from "@/features/loader";

export default function Page() {
  const [playing, setPlaying] = useState(true);
  const router = useRouter();
  const text = useGlobalStore((s) => s.feedback);
  const language = useGlobalStore((s) => s.language);
  const audioBlob = useGlobalStore((s) => s.audioBlob);
  const setFeedback = useGlobalStore((s) => s.setFeedback);
  const payload: FeedbackPostPayload = {
    text,
    language,
  };
  
  const audioPayload: FeedbackAudioPostPayload | null = audioBlob
  ? { audio: audioBlob, language }
  : null;

  const handleClose = () => {
    setFeedback("");
    router.push(navigationUrls.home);
  };

  const getQuery = useQuery({
    queryKey: [apiEndpoints.feedback, payload],
    queryFn: () => {
      return api.post(apiEndpoints.feedback, payload);
    },
    enabled: !!payload.text,
  });

  const { categories = {} } = (getQuery.data?.data || {}) as {
    categories: Record<string, string>;
  };
  
  // TODO temporary code placement - need refactor
  const getAudioQuery = useQuery({
    queryKey: ["audioFeedback", !!audioBlob], // Ensures queryKey is stable
    queryFn: async () => {
      if (!audioBlob) {
        console.error("Audio not recorded yet");
        return;
      }
  
      const formData = new FormData();
      formData.append("audio", audioBlob, "feedback_audio.webm");
      formData.append("language", language);
  
      console.log("Audio feedback API calling...", audioBlob);
  
      return fetch("https://polished-snipe-rapidly.ngrok-free.app/api/v1/audio/feedback", {
        method: "POST",
        body: formData,
        headers: {
          // Do NOT set 'Content-Type' explicitly; the browser sets it automatically for FormData
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to upload audio");
        }
        return res.json();
      });
    },
    enabled: Boolean(audioBlob), // Ensures API is called only when audioBlob exists
    retry: false, // Prevents unnecessary retries if no audio is present
  });

  const audioCategories: Record<string, string> = getAudioQuery.data?.categories || {};

  return (
    <div className="flex flex-col gap-2 lg:gap-6 items-center">
      <SakhiVideoPlayer
        playing={playing}
        src={avatarVideoUrls.baseUrl}
        onPlaybackEnded={() => {
          setPlaying(false);
        }}
        playbackTimings={videoConfig["FINISH"].playbackTimings}
      />
      <div className="mb-2 lg:mb-4 text-lg lg:text-4xl font-bold">
        మీ అభిప్రాయం తెలియచేసినందుకు ధన్యవాదాలు!
      </div>
      <div className="bg-elevated p-4 lg:p-8 w-full rounded-3xl">
        <div className="text-md lg:text-2xl font-medium mb-2 lg:mb-8">
          అభిప్రాయ సారాంశం
        </div>
        {/* {getQuery.isFetching ? (
          <div className="flex flex-col gap-2 w-full h-full min-h-[200px] items-center justify-center">
            <Loader /> అభిప్రాయాన్ని రూపొందిస్తోంది...
          </div>
        ) : (
          <ol className="flex text-sm lg:text-base flex-col gap-4 lg:gap-6 list-decimal list-inside text-primary-text">
            {Object.entries(categories).map(([title, description]) => (
              <li key={title}>
                <span className="font-medium">{title}</span>
                <div className="text-xs lg:text-sm mt-4">{description}</div>
              </li>
            ))}
          </ol>
        )} */}
        {getAudioQuery.isFetching ? (
          <div className="flex flex-col gap-2 w-full h-full min-h-[200px] items-center justify-center">
            <Loader /> అభిప్రాయాన్ని రూపొందిస్తోంది...
          </div>
        ) : (
          <ol className="flex text-sm lg:text-base flex-col gap-4 lg:gap-6 list-decimal list-inside text-primary-text">
            {Object.entries(audioCategories).map(([title, description]) => (
              <li key={title}>
                <span className="font-medium">{title}</span>
                <div className="text-xs lg:text-sm mt-4">{description}</div>
              </li>
            ))}
          </ol>
        )}


      </div>

      <button
        className="flex gap-2 text-on-primary bg-primary font-medium px-6 py-2 rounded-4xl cursor-pointer items-center"
        onClick={handleClose}
      >
        <RxCross2 />
        మూసివేయి
      </button>
    </div>
  );
}
