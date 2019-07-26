import { Twitter } from "./twitter";

export const getUserInfo = async (screen_name: string) => {
  const params = {
    screen_name
  };
  const user = await Twitter.get("users/show", params);
  return user;
};
