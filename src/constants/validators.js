export const validateUserPreferences = (preferences) => {
  const _errors = {};

  if (!preferences.nickname) {
    _errors.nickname = "مطلوب";
  }

  if (preferences.nickname && preferences.nickname.length < 5) {
    _errors.nickname = "يجب ان يتكون من 5 محارف على الاقل";
  }
  if (preferences.nickname && preferences.nickname.length > 15) {
    _errors.nickname = "يجب ان يتكون من 15 محرف على الاكثر";
  }

  return Object.keys(_errors).length ? _errors : null;
};

export const validateNewPassword = (password) => {
  if (!password.length) return "مطلوب";
  if (password.length < 10)
    return "يجب ان تكون كلمة المرور مؤلفة من 10 محارف على الاقل";
  return undefined;
};
