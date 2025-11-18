import Cookies from "js-cookie";

export const deleteCookie = (name: string, path: string = "/"): void => {
  Cookies.remove(name, { path });
};
