export const navigationUrls = {
  record: "/record",
  home: "/",
  feedback: "/feedback",
};

export const apiEndpoints = {
  feedback: "/feedback",
};

const LANGUAGES = {
  ENGLISH: "en-US",
  TELUGU: "te",
};

export const languageOptions = [
  {
    value: LANGUAGES.ENGLISH,
    label: "English",
  },
  {
    value: LANGUAGES.TELUGU,
    label: "Telugu",
  },
];

export const avatarVideoUrls = {
  baseUrl:
    "https://public-content-dp.s3.us-east-2.amazonaws.com/Final_Peri_V1_Cropped.mp4",
};

export const videoConfig = {
  START: { playbackTimings: { start: 0, end: 15 } },
  LISTEN: { playbackTimings: { start: 17, end: 18 } },
  FINISH: { playbackTimings: { start: 22, end: 31 } },
};
