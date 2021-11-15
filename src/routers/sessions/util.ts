import { Channel } from "./types";

export const ParseChannel = (channel: string): Channel | null => {
  if (channel !== Channel.Instructor && channel !== Channel.Student) {
    return null;
  }
  return channel;
};
