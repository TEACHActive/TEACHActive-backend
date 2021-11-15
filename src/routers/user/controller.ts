import faker from "faker";

import { Response } from "../types";
import { TokenSign } from "./types";
import { User, UserModel } from "../../models/userModel";

export const getUser = async (
  tokenSign: TokenSign
): Promise<Response<User | null>> => {
  if (!tokenSign) {
    const error = "Issue identifying user from token";
    return new Response(false, null, 401, error);
  }

  const filter = { uid: tokenSign.uid };
  const matchingUser = await UserModel.findOne(filter).exec();

  if (!matchingUser) {
    //Return random name to give less info to anyone trying to scrape data
    const fakeUser = new User({
      name: faker.name.findName(),
      email: faker.internet.email().split("@")[0] + "@iastate.edu",
      uid: faker.random
        .alphaNumeric(28)
        .split("")
        .map((character) => {
          if (Math.random() > 0.5) return character.toUpperCase();
          return character;
        })
        .join(""),
    });
    return new Response(true, fakeUser);
  }

  return new Response(true, new User(matchingUser.toObject()));
};
