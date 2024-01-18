import { getCookies, deleteCookie } from "cookies-next";

export const deleteAllCookies = () => {
  const cookies = getCookies();
  Object.keys(cookies).forEach((cookieName) => {
    deleteCookie(cookieName);
  });
};
