import { User } from "../../models/userModel";
import { generateAccessToken } from "./controller";

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
const firebaseTokenFake = "XXYYZZ";

const defaultExpireTimeSeconds = 1800;

describe("generateAccessToken", () => {
  it("Generates a jwt token", () => {
    const result = generateAccessToken(
      user.uid,
      firebaseTokenFake,
      tokenSecret,
      defaultExpireTimeSeconds
    );
    expect(typeof result?.token).toBeDefined();
    expect(typeof result?.token).toBe("string");
    expect(result?.token.split(".")).toHaveLength(3);
  });

  it("Generates a valid jwt token with invalid expire time", () => {
    const result = generateAccessToken(
      user.uid,
      firebaseTokenFake,
      tokenSecret,
      -1
    );
    expect(typeof result?.token).toBeDefined();
    expect(typeof result?.token).toBe("string");
    expect(result?.token.split(".")).toHaveLength(3);
  });
});
