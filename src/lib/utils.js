import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateRandomPassword = () => {
  const getRandomNumberInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  let pass = "";
  for (let i = 0; i < 15; i++) {
    pass += String.fromCharCode(getRandomNumberInRange(65, 90))[
      i % 2 === 0 ? "toLowerCase" : "toUpperCase"
    ]();
  }
  return pass;
};
