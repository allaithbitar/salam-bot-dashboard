import { enc, DES } from "crypto-js";

export const encrypt = (string) => {
  const parsedPassword = enc.Utf8.parse(string);
  const key = enc.Utf8.parse(import.meta.env.VITE_HASH_SALT);
  const iv = enc.Hex.parse(import.meta.env.VITE_IV);
  return DES.encrypt(parsedPassword, key, { iv }).toString();
};

export const decrypt = (string) => {
  const key = enc.Utf8.parse(import.meta.env.VITE_HASH_SALT);
  const iv = enc.Hex.parse(import.meta.env.VITE_IV);
  return DES.decrypt(string, key, { iv }).toString(enc.Utf8);
};
