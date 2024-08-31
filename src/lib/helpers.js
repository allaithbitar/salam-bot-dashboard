export const isDuplicateNicknameError = (error) =>
  error.code === "23505" && error.details?.includes("nickname");

export const transformNickname = (nickname) =>
  nickname.replaceAll(" ", "").trim();

export const transformPassword = (password) =>
  password.replaceAll(" ", "").trim();
