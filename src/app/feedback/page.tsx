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
import { FeedbackAudioPostPayload } from "@/schemas/feedback";
import { useRouter } from "next/navigation";
import SakhiVideoPlayer from "@/features/sakhi-avatar-video";
import { useState } from "react";
import Loader from "@/features/loader";

export default function Page() {
  const [playing, setPlaying] = useState(true);
  const router = useRouter();
  const language = useGlobalStore((s) => s.language);
  const audioBlob = useGlobalStore((s) => s.audioBlob);
  const setFeedback = useGlobalStore((s) => s.setFeedback);
  const payload: FeedbackAudioPostPayload = {
    audio: audioBlob,
    language,
  };

  const handleClose = () => {
    setFeedback("");
    router.push(navigationUrls.home);
  };

  const getQuery = useQuery({
    queryKey: [apiEndpoints.audioFeedback, payload],
    queryFn: () => {
      const formData = new FormData();
      if (!payload.audio) return;
      formData.append("audio", payload.audio, "feedback_audio.webm");
      formData.append("language", payload.language);
      return api.post(apiEndpoints.audioFeedback, formData);
    },
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { categories = {} } = (getQuery.data?.data || {}) as {
    categories: Record<string, string>;
  };

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
        {getQuery.isFetching ? (
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
