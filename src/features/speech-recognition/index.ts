import { useCallback, useEffect, useRef, useState } from "react";
import AudioMotionAnalyzer, {
  ConstructorOptions as AudioMotionOptions,
} from "audiomotion-analyzer";
import { useSpeechRecognition as useBaseSpeechRecognition } from "react-speech-kit";

type UseSpeechRecognitionOptions = {
  language?: string;
};

export const useSpeechRecognition = ({
  language = "en-US",
}: UseSpeechRecognitionOptions) => {
  const [transcript, setTranscript] = useState("");
  const { listen, listening, stop } = useBaseSpeechRecognition({
    onResult: (result) => {
      setTranscript(result as unknown as string);
    },
  });

  const start = useCallback(async () => {
    listen({ lang: language, interimResults: true });
  }, [listen, language]);

  return {
    start,
    stop,
    listening,
    transcript,
  };
};

type UseMicWaveformOptions = {
  waveColor?: string;
  onRecordEnd: (data: Blob) => void;
};

export const useMicWaveform = (options: UseMicWaveformOptions) => {
  const { waveColor = "#e6ba64", onRecordEnd } = options;
  const targetRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<AudioMotionAnalyzer | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[] | null>([]);

  useEffect(() => {
    if (!targetRef.current) return;
    waveformRef.current = createAudioMotionAnalyzer(targetRef.current, {
      ...audioMotionDefaultOptions,
      waveColor,
    });
    return () => {
      waveformRef.current?.destroy();
    };
  }, [waveColor]);

  const start = useCallback(async () => {
    try {
      if (!waveformRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
        video: false,
      });
      mediaStreamSourceRef.current =
        waveformRef.current.audioCtx.createMediaStreamSource(stream);
      waveformRef.current.volume = 0;
      waveformRef.current.connectInput(mediaStreamSourceRef.current);
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.start();
      recorderRef.current?.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          recordingChunksRef.current?.push(e.data);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!recordingChunksRef.current) return;
      const blob = new Blob(recordingChunksRef.current, {
        type: "audio/ogg; codecs=opus",
      });
      onRecordEnd(blob);
      recordingChunksRef.current = [];
    };
    recorderRef.current?.addEventListener("stop", handler);
    return () => {
      recorderRef.current?.removeEventListener("stop", handler);
    };
  }, [onRecordEnd]);

  const stop = useCallback(async () => {
    recorderRef.current?.stop();
    waveformRef.current?.disconnectInput(mediaStreamSourceRef.current, true);
  }, []);

  return { start, stop, targetRef };
};

type UseMediaWaveformProps = {
  waveColor?: string;
  source: HTMLMediaElement | null;
  onRender?: (instance: AudioMotionAnalyzer) => void;
};

export const useMediaWaveform = (options: UseMediaWaveformProps) => {
  const { waveColor = "#ede6d8", source, onRender } = options;
  const targetRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<AudioMotionAnalyzer | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    if (!source) return;
    waveformRef.current = createAudioMotionAnalyzer(targetRef.current, {
      ...audioMotionDefaultOptions,
      source,
      waveColor,
    });
    return () => {
      waveformRef.current?.destroy();
    };
  }, [source, waveColor]);

  useEffect(() => {
    if (!waveformRef.current) return;
    waveformRef.current.setOptions({ onCanvasDraw: onRender });
  }, [onRender]);

  const stop = useCallback(async () => {
    waveformRef.current?.stop();
    waveformRef.current?.destroy();
  }, []);

  return { waveformRef, targetRef, stop };
};

const audioMotionDefaultOptions: AudioMotionOptions = {
  mode: 10,
  barSpace: 0.6,
  showBgColor: false,
  bgAlpha: 0,
  showScaleX: false,
  overlay: true,
  reflexRatio: 0.5,
  reflexAlpha: 1,
  alphaBars: true,
  showPeaks: false,
};

function createAudioMotionAnalyzer(
  target: HTMLElement,
  { waveColor, ...options }: AudioMotionOptions & { waveColor: string },
) {
  const analyzer = new AudioMotionAnalyzer(target, {
    ...audioMotionDefaultOptions,
    ...options,
  });
  analyzer.registerGradient("wave-color", {
    bgColor: "transparent",
    colorStops: [waveColor],
  });
  analyzer.setOptions({
    gradient: "wave-color",
  });
  return analyzer;
}
