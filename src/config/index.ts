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
    "https://public-content-dp.s3.us-east-2.amazonaws.com/Profession_heygen_V2.mp4",
};

export const videoConfig = {
  START: { playbackTimings: { start: 0, end: 25 } },
  LISTEN: { playbackTimings: { start: 25, end: 29 } },
  FINISH: { playbackTimings: { start: 31, end: 44 } },
};
