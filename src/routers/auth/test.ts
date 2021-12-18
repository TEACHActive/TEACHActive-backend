import { User } from "../../models/userModel";
import { generateJWTToken } from "./controller";

// const adminUser = new User({
//   uid: "ABCDEFGHIJKLMNOPQRSTUVWXYZAB",
//   email: "expressTest@example.com",
//   name: "TestAdminUser",
//   isAdmin: true,
// });
const user = new User({
  uid: "BCDEFGHIJKLMNOPQRSTUVWXYZABC",
  email: "expressTest2@example.com",
  name: "TestNormalUser",
  isAdmin: false,
});
const tokenSecret =
  "HBZtzz0H+SyMoaZ5gfaQL781BUi1wJ+d+z3JXi7cSFyfjUMTMZra12UO1JLZIQjl/hxhk3dngTAVY/hO";

const defaultExpireTimeSeconds = 1800;

describe("generateAccessToken", () => {}); // TODO: ?

describe("generateJWTToken", () => {
  it("Generates a jwt token", () => {
    const accessToken = generateJWTToken(
      user.uid,
      tokenSecret,
      defaultExpireTimeSeconds
    );
    expect(typeof accessToken).toBe("string");
    expect(accessToken.split(".")).toHaveLength(3);
  });

  it("Generates a valid jwt token with invalid expire time", () => {
    const accessToken = generateJWTToken(user.uid, tokenSecret, -1);
    expect(typeof accessToken).toBe("string");
    expect(accessToken.split(".")).toHaveLength(3);
    // const token = jwt.decode(accessToken, { json: true });
    // expect(token?.exp).toBe(defaultExpireTimeSeconds);
  });
});
