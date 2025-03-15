import { useCallback, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition as useBaseSpeechRecognition,
} from "react-speech-recognition";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { useGlobalStore } from "../global-store/context";

type UseSpeechRecognitionOptions = {
  language?: string;
};

export const useSpeechRecognition = ({
  language,
}: UseSpeechRecognitionOptions) => {
  const speechToText = useBaseSpeechRecognition();
  const { resetTranscript, listening } = speechToText;
  const isSupported = SpeechRecognition.browserSupportsSpeechRecognition();

  const start = useCallback(async () => {
    if (!listening) {
      await SpeechRecognition.startListening({ continuous: true, language });
    }
  }, [language, listening]);

  const stop = useCallback(async () => {
    if (!listening) return;
    await SpeechRecognition.stopListening();
  }, [listening]);

  const toggleListening = useCallback(async () => {
    if (listening) {
      await stop();
      return;
    }
    await start();
  }, [listening, start, stop]);

  const reset = useCallback(async () => {
    if (listening) await stop();
    resetTranscript();
  }, [listening, resetTranscript, stop]);

  return {
    isSupported,
    toggleListening,
    reset,
    start,
    stop,
    ...speechToText,
  };
};

type UseWaveformOptions = {
  useMic?: boolean;
  url?: string;
  waveColor?: string;
  progressColor?: string;
};

export const useWaveform = (options: UseWaveformOptions = {}) => {
  const {
    useMic = true,
    waveColor = options.useMic ? "#ede6d8" : "#d7b36e",
    progressColor = "#ede6d8",
    url,
  } = options;
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recorderRef = useRef<RecordPlugin | null>(null);
  // Use global store to manage audioBlob
  const setAudioBlob = useGlobalStore((s) => s.setAudioBlob);
  useEffect(() => {
    if (!waveformRef.current) return;
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor,
      progressColor,
      backend: "WebAudio",
      cursorWidth: 0,
      fillParent: true,
      interact: false,
      sampleRate: 3000,
    });
    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [progressColor, waveColor]);

  useEffect(() => {
    if (!useMic) return;
    const recordPluginInstance = RecordPlugin.create({
      renderRecordedAudio: false,
      continuousWaveform: false,
    });
    recorderRef.current = recordPluginInstance;
    wavesurferRef.current?.registerPlugin(recordPluginInstance);
    
    // Listen for record end event
    recorderRef.current.on("record-end", (blob: Blob) => {
      console.log("Audio recorded:", blob);
      setAudioBlob(blob); // Save the audio Blob globally
    });

    return () => {
      recorderRef.current?.stopMic();
      recorderRef.current?.stopRecording();
      recorderRef.current?.destroy();
    };
  }, [useMic,setAudioBlob]);

  const start = useCallback(async () => {
    if (recorderRef.current) {
      await recorderRef.current.startRecording();
    }
  }, []);

  const stop = useCallback(async () => {
    if (recorderRef.current) {
      await recorderRef.current.stopRecording();
    }
  }, []);

  useEffect(() => {
    try {
      if (!url) return;
      wavesurferRef.current?.load(url);
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  return { start, stop, waveformRef, wavesurferRef };
};
