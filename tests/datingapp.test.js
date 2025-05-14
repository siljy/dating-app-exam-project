import {
  createUserProfile,
  parseAgeRange,
  displayRandomPerson,
} from "../datingapp.js";

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

describe("Testing displaying random person in DOM", () => {
  let randomPersonDiv;

  beforeEach(() => {
    document.body.innerHTML = `<div id="random-person-display" </div>`;
    randomPersonDiv = document.getElementById("random-person-display");
  });

  test("displayRandomPerson updates innerHTML", async () => {
    const randomPerson = {
      name: "Donald Duck",
      img: "img.jpg",
      location: "Duckville",
      age: 40,
      gender: "male",
    };

    await displayRandomPerson(randomPerson, randomPersonDiv);

    expect(randomPersonDiv.innerHTML).toBe(
      `<h3>${randomPerson.name}</h3><img src="${randomPerson.img}"><h4>${randomPerson.age}</h4><p>${randomPerson.location}</p><button>Find new match</button><button>Like</button>`
    );
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
