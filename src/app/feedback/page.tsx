"use client";
import "regenerator-runtime/runtime";

import { apiEndpoints, navigationUrls } from "@/config";
import { useGlobalStore } from "@/features/global-store/context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { RxCross2 } from "react-icons/rx";
import { GoAlertFill } from "react-icons/go";
import { FeedbackPostData, FeedbackPostPayload } from "@/schemas/feedback";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Loader from "@/features/loader";
import { useParticles } from "@/features/particles";
import { useMediaWaveform } from "@/features/speech-recognition";

export default function Page() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
  const particles = useParticles();
  const mediaWaveform = useMediaWaveform({
    source: audioRef.current,
    onRender: (instance) => {
      particles.startAnimation(instance.getEnergy());
    },
  });
  const language = useGlobalStore((s) => s.language);
  const audioBlob = useGlobalStore((s) => s.audioBlob);
  const setFeedback = useGlobalStore((s) => s.setFeedback);
  const payload: FeedbackPostPayload = {
    audio: audioBlob,
    language,
  };

  const handleClose = () => {
    setFeedback("");
    router.push(navigationUrls.home);
  };

  const getQuery = useQuery({
    queryKey: [apiEndpoints.audioFeedback, payload],
    queryFn: async () => {
      const formData = new FormData();
      if (!payload.audio) return;
      formData.append("audio", payload.audio, "feedback_audio.webm");
      formData.append("language", payload.language);
      const res = await api.post(apiEndpoints.audioFeedback, formData);
      return {
        categories: {
          generalFeedback: res.data.categories.general_feedback,
          personalFeedback: res.data.categories.personal_feedback,
        },
        audioUrl: res.data.audio_url,
        criticalComplaints: {
          alertTrigger: res.data.critical_complaints.alert_trigger,
          criticalTypes: res.data.critical_complaints.critical_types,
        },
      } as FeedbackPostData;
    },
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { isFetching } = getQuery;
  const { audioUrl } = getQuery.data || {};
  const { generalFeedback = {}, personalFeedback = {} } =
    getQuery.data?.categories || {};
  const { alertTrigger = false, criticalTypes } =
    getQuery.data?.criticalComplaints || {};

  useEffect(() => {
    if (isFetching) return;
    audioRef.current?.play();
  }, [audioUrl, isFetching]);

  return (
    <div className="flex flex-col gap-2 lg:gap-6 items-center">
      <canvas ref={particles.canvasRef} width={200} height={200} />
      <audio
        ref={audioRef}
        src={audioUrl}
        controls={false}
        crossOrigin="anonymous"
      />
      <div ref={mediaWaveform.targetRef} className="h-[64px]" />
      <div className="mb-2 lg:mb-4 text-lg lg:text-4xl font-bold">
        మీ అభిప్రాయం తెలియచేసినందుకు ధన్యవాదాలు!
      </div>
      {!isFetching && alertTrigger && (
        <Alert
          text={`This form has been flagged for ${criticalTypes?.join(
            ", ",
          )} reasons.`}
        />
      )}
      <div className="bg-elevated p-4 lg:p-8 w-full rounded-3xl">
        {getQuery.isFetching ? (
          <div className="flex flex-col gap-2 w-full h-full min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <FeedbackPoints title="అభిప్రాయం" feedback={generalFeedback} />
            <FeedbackPoints
              title="వ్యక్తిగత సమస్యలు"
              feedback={personalFeedback}
            />
          </>
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

type FeedbackPointsProps = {
  title: string;
  feedback: Record<string, string>;
};

function FeedbackPoints({ title, feedback }: FeedbackPointsProps) {
  return (
    <>
      <div className="text-md lg:text-xl font-medium mb-2 lg:mb-8">{title}</div>
      <ol className="flex text-sm lg:text-base flex-col gap-4 lg:gap-6 list-decimal list-inside text-primary-text">
        {Object.entries(feedback).map(([title, description]) => (
          <li key={title}>
            <span className="font-medium">{title}</span>
            <div className="text-xs lg:text-sm mt-4">{description}</div>
          </li>
        ))}
      </ol>
    </>
  );
}

type AlertProps = {
  text: string;
};

function Alert({ text }: AlertProps) {
  return (
    <div className="bg-primary text-black flex gap-2 items-center p-2 rounded-md">
      <GoAlertFill />
      {text}
    </div>
  );
}
