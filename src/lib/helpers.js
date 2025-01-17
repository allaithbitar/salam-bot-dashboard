export const isDuplicateNicknameError = (error) =>
  typeof error === "string" && error?.includes("duplicate key value");

export const transformNickname = (nickname) =>
  nickname.replaceAll(" ", "").trim();

export const transformPassword = (password) =>
  password.replaceAll(" ", "").trim();

export function getErrorMessage(error) {
  let errorMessage;

  if (typeof error === "string") {
    errorMessage = error;
  }

  errorMessage =
    errorMessage ??
    error?.response?.data?.error ??
    error?.response?.data?.message ??
    error?.error?.message ??
    error.message ??
    "SOMETHING_WENT_WRONG";
  return errorMessage;
}
