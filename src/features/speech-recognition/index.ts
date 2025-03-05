import { useCallback, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition as useBaseSpeechRecognition,
} from "react-speech-recognition";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

type UseSpeechRecognitionOptions = {
  runOnMount?: boolean;
};

export const useSpeechRecognition = ({
  runOnMount,
}: UseSpeechRecognitionOptions) => {
  const speechToText = useBaseSpeechRecognition();
  const { resetTranscript, listening } = speechToText;
  const isSupported = SpeechRecognition.browserSupportsSpeechRecognition();

  const start = useCallback(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  const stop = useCallback(() => {
    SpeechRecognition.stopListening();
    SpeechRecognition.abortListening();
  }, []);

  const toggleListening = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    start();
  }, [listening, start, stop]);

  const reset = useCallback(() => {
    if (listening) stop();
    resetTranscript();
  }, [listening, resetTranscript, stop]);

  useEffect(() => {
    if (runOnMount) start();
  }, [runOnMount, start]);

  return {
    isSupported,
    toggleListening,
    reset,
    start,
    stop,
    ...speechToText,
  };
};

type UseMicrophoneWaveformOptions = {
  runOnMount?: boolean;
  waveColor?: string;
  progressColor?: string;
};

export const useMicrophoneWaveform = (
  options: UseMicrophoneWaveformOptions = {}
) => {
  const {
    runOnMount,
    waveColor = "#d7b36e",
    progressColor = "#ede6d8",
  } = options;
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recorderRef = useRef<RecordPlugin | null>(null);

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
    const recordPluginInstance = RecordPlugin.create({
      renderRecordedAudio: false,
      continuousWaveform: false,
    });
    recorderRef.current = recordPluginInstance;
    wavesurferRef.current.registerPlugin(recordPluginInstance);
    return () => {
      wavesurferRef.current?.destroy();
      recorderRef.current?.stopMic();
      recorderRef.current?.stopRecording();
      recorderRef.current?.destroy();
    };
  }, [progressColor, waveColor]);

  const start = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.startRecording();
    }
  }, []);

  const stop = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording();
    }
  }, []);

  useEffect(() => {
    if (runOnMount) {
      start();
    }
    return () => {
      stop();
    };
  }, [runOnMount, start, stop]);

  return { start, stop, waveformRef };
};
