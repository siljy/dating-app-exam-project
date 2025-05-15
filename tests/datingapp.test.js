import {
  createUserProfile,
  parseAgeRange,
  displayRandomPerson,
  createCard,
  getFromLocalStorage,
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

test("createCard uses object to create HTML", () => {
  const randomPerson = {
    name: "Donald Duck",
    img: "img.jpg",
    location: "Duckville",
    age: "40",
    gender: "male",
  };

  const card = createCard(randomPerson);

  expect(card.querySelector("h3").innerHTML).toContain(randomPerson.name);
  expect(card.querySelector("img").src).toContain(randomPerson.img);
  expect(card.querySelector("h4").innerHTML).toContain(randomPerson.age);
  expect(card.querySelector("p").innerHTML).toContain(randomPerson.location);
});

describe("Testing displaying random person in DOM", () => {
  let randomPersonDiv;

  const randomPerson = {
    name: "Donald Duck",
    img: "donald.jpg",
    location: "Duckville",
    age: "40",
    gender: "male",
  };

  beforeEach(() => {
    document.body.innerHTML = `<div id="random-person-display"> </div>`;
    randomPersonDiv = document.getElementById("random-person-display");
  });

  test("displayRandomPerson updates innerHTML", async () => {
    await displayRandomPerson(randomPerson, randomPersonDiv);

    expect(randomPersonDiv.innerHTML).toBe(
      `<div><h3>${randomPerson.name}</h3><img src="${randomPerson.img}"><h4>${randomPerson.age}</h4><p>${randomPerson.location}</p><button>Find new match</button><button>Like</button></div>`
    );
  });

  test("displayRandomPerson only displays one person at a time if called more than once", async () => {
    await displayRandomPerson(randomPerson, randomPersonDiv);
    await displayRandomPerson(randomPerson, randomPersonDiv);
    await displayRandomPerson(randomPerson, randomPersonDiv);

    expect(randomPersonDiv.querySelectorAll("h3").length).toBe(1);
  });

  test("displayRandomPerson clears previous person for new person", async () => {
    randomPersonDiv.innerHTML = `<h3>Old name</h3><img src="old-img.jpg"><h4>Old age</h4>`;

    await displayRandomPerson(randomPerson, randomPersonDiv);

    expect(randomPersonDiv.innerHTML).not.toContain(
      `<h3>Old name</h3><img src="old-img.jpg"><h4>Old age</h4>`
    );

    expect(randomPersonDiv.innerHTML).toContain(
      `<h3>${randomPerson.name}</h3><img src="${randomPerson.img}"><h4>${randomPerson.age}</h4>`
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

test("getFromLocalStorage fetches data object stored in localStorage", () => {
  const savedData = {
    name: "Donald Duck",
    img: "img.jpg",
    location: "Duckville",
    age: 40,
    gender: "male",
  };

  localStorage.setItem("Data", JSON.stringify(savedData));

  const fetchedData = getFromLocalStorage("Data");

  expect(fetchedData).toEqual(savedData);
});
