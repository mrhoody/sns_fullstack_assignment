import { getCookies, deleteCookie } from "cookies-next";

const deleteAllCookies = () => {
  const cookies = getCookies();
  Object.keys(cookies).forEach((cookieName) => {
    deleteCookie(cookieName);
  });
};

const checkCookieExists = (cookieName: string) => {
  const cookies = getCookies();
  return cookies[cookieName] !== undefined;
};

export { deleteAllCookies, checkCookieExists };
