import { createUserProfile, parseAgeRange } from "../datingapp.js";

describe("Testing user profile and DOM", () => {
  let profileDiv;

  beforeEach(() => {
    document.body.innerHTML = `<div id="user-profile" </div>`;
    profileDiv = document.getElementById("user-profile");
  });

  test("createUserProfile updates innerHTML for the div", () => {
    let user = { username: "hei", password: "123" };

    createUserProfile(user, profileDiv);

    expect(profileDiv.querySelector("h3").innerHTML).toBe("hei");
    expect(profileDiv.querySelector("p").innerHTML).toBe("Password: 123");
  });
});

test("parseAgeRange parses string to number", () => {
  const ageRange = "10-12";
  const parsedRange = parseAgeRange(ageRange);

  expect(parsedRange).toEqual({ min: 10, max: 12 });
});

test("parseAgeRange parses 65+", () => {
  const ageRange = "65-plus";
  const parsedRange = parseAgeRange(ageRange);

  expect(parsedRange).toEqual({ min: 65, max: 122 });
});
