import { userUrl, favUrl } from "./config/auth.js";
import { saveToLocalStorage } from "./login.js";
import { deleteFromCrudCrud } from "./requests/delete.js";
import {
  getDataFromCrudCrud,
  getGender,
  getRandomUser,
} from "./requests/get.js";
import { postPerson } from "./requests/post.js";
import { editUser } from "./requests/put.js";

export function getFromLocalStorage(key) {
  let localData = JSON.parse(localStorage.getItem(key));
  return localData;
}

//User profile
const profileDiv = document.getElementById("user-profile");
const localUser = getFromLocalStorage("User");

export function createUserProfile(user, container) {
  const title = document.createElement("h2");
  title.innerHTML = "Your profile";

  const profileUsername = document.createElement("h3");
  profileUsername.innerHTML = user.username;

  const profilePassword = document.createElement("p");
  profilePassword.innerHTML = `Password: ${user.password}`;

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit profile";
  editBtn.addEventListener("click", () => {
    updateUserProfile();
  });

  container.innerHTML = "";
  container.append(title, profileUsername, profilePassword, editBtn);
}

async function updateUserProfile() {
  const user = getFromLocalStorage("User");

  const userId = user._id;
  const newUsername = prompt("New username", user.username);
  const newPassword = prompt("New password", user.password);

  if (!newUsername || !newPassword) {
    alert("Field cannot be empty, user profile not updated");
  } else {
    const updatedUser = {
      username: newUsername,
      password: newPassword,
    };

    await editUser(userUrl, userId, updatedUser);
    const updatedCrudUser = { ...updatedUser, _id: user._id };
    saveToLocalStorage("User", updatedCrudUser);
    profileDiv.innerHTML = "";
    createUserProfile(updatedUser, profileDiv);
  }
}

//Finding a match
export async function createRandomObject() {
  let randomPerson = await getRandomUser();
  let randomName = `${randomPerson[0].name.first} ${randomPerson[0].name.last}`;
  let randomImg = randomPerson[0].picture.large;
  let randomLocation = `${randomPerson[0].location.city}, ${randomPerson[0].location.country}`;
  let randomAge = randomPerson[0].dob.age;
  let randomGender = randomPerson[0].gender;

  let person = {
    name: randomName,
    img: randomImg,
    location: randomLocation,
    age: randomAge,
    gender: randomGender,
  };
  saveToLocalStorage("Random person", person);
  return person;
}

export function createCard(person) {
  const card = document.createElement("div");

  const displayName = document.createElement("h3");
  displayName.innerHTML = person.name;

  const displayImg = document.createElement("img");
  displayImg.src = person.img;

  const displayAge = document.createElement("h4");
  displayAge.innerHTML = person.age;

  const displayLocation = document.createElement("p");
  displayLocation.innerHTML = person.location;

  card.append(displayName, displayImg, displayAge, displayLocation);
  return card;
}

let randomPersonDiv = document.getElementById("random-person-display");

export async function displayRandomPerson(person, container) {
  container.innerHTML = "";
  const card = createCard(person);

  const noBtn = document.createElement("button");
  noBtn.innerHTML = "Find new match";
  noBtn.addEventListener("click", () => {
    newPerson();
  });

  const yesBtn = document.createElement("button");
  yesBtn.innerHTML = "Like";
  yesBtn.addEventListener("click", () => {
    swipeYes(person);
  });

  card.append(noBtn, yesBtn);
  container.append(card);
}

async function checkLocalStorage() {
  let localPerson = getFromLocalStorage("Random person");
  if (localPerson) {
    displayRandomPerson(localPerson, randomPersonDiv);
  } else {
    const filters = getFromLocalStorage("Filters");
    if (filters) {
      filterPeople(filters.gender, filters.age);
    } else {
      const person = await createRandomObject();
      displayRandomPerson(person, randomPersonDiv);
    }
  }

  let localFavorites = getFromLocalStorage("Favorites");
  if (!localFavorites) {
    return;
  } else {
    displayFavorites(localFavorites);
  }

  let localMatches = getFromLocalStorage("Matches");
  if (!localMatches) {
    return;
  } else {
    displayMatches(localMatches);
  }
}

const applyFilterBtn = document.getElementById("apply-filters");
const removeFilterBtn = document.getElementById("remove-filters");

function getFilters() {
  let selectedAgeRange = document.getElementById("age-range").value;
  let selectedGenderRadio = document.querySelector(
    'input[name="gender"]:checked'
  );

  if (!selectedGenderRadio) {
    alert("Select men, women or both to apply filters");
  } else {
    let selectedGender = selectedGenderRadio.value;
    let filters = {
      age: selectedAgeRange,
      gender: selectedGender,
    };
    saveToLocalStorage("Filters", filters);
    filterPeople(filters.gender, filters.age);
  }
}

export async function filterPeople(gender, age) {
  const { min, max } = parseAgeRange(age);

  let matchedPerson = null;

  while (!matchedPerson) {
    const people = await getGender(gender);

    people.forEach((person) => {
      const age = person.dob.age;

      if (age >= min && age <= max) {
        matchedPerson = {
          name: `${person.name.first} ${person.name.last}`,
          img: person.picture.large,
          location: `${person.location.city}, ${person.location.country}`,
          age: person.dob.age,
          gender: person.gender,
        };
        saveToLocalStorage("Random person", matchedPerson);
      }
    });
  }

  displayRandomPerson(matchedPerson, randomPersonDiv);
  return matchedPerson;
}

export function parseAgeRange(range) {
  if (range === "65-plus") {
    return { min: 65, max: 122 };
  }

  const [min, max] = range.split("-").map(Number);
  return { min, max };
}

//Swipe functionality
async function newPerson() {
  const filters = getFromLocalStorage("Filters");
  if (filters) {
    filterPeople(filters.gender, filters.age);
  } else {
    const person = await createRandomObject();
    displayRandomPerson(person, randomPersonDiv);
  }
}

let savedDiv = document.getElementById("favorites");

//Part of Extra feature
let counter = 0;

async function swipeYes(person) {
  await postPerson(favUrl, person);
  updateLocalFavorite();
  newPerson();

  //Part of Extra feature
  counter++;
  randomMatch(person);
}

async function updateLocalFavorite() {
  savedDiv.innerHTML = "";
  localStorage.removeItem("Favorites");

  let crudFavoritesArray = await getDataFromCrudCrud(favUrl);
  saveToLocalStorage("Favorites", crudFavoritesArray);

  let localFavoritesArray = getFromLocalStorage("Favorites");

  displayFavorites(localFavoritesArray);
}

async function displayFavorites(savedPeople) {
  savedDiv.innerHTML = "";
  savedPeople.forEach((person) => {
    const card = createCard(person);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await deleteFromCrudCrud(favUrl, person._id);
      updateLocalFavorite();
    });

    card.append(deleteBtn);
    savedDiv.append(card);

    card.style.width = "150px";
    card.style.margin = "20px";
    card.style.padding = "10px";
  });
  savedDiv.style.display = "flex";
}

//Extra feature: Randomly match with favorites
export function randomNumber(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  let randomNumber = Math.floor(Math.random() * (maxFloor - minCeil) + min);
  return randomNumber;
}

let number = randomNumber(2, 7);

let matchDiv = document.getElementById("matches");

function randomMatch(match) {
  console.log("Number of clicks:", counter);
  console.log("Random number", number);

  if (counter == number) {
    alert(`You've matched with ${match.name}!`);
    counter = 0;
    number = randomNumber(2, 7);

    let matches = getFromLocalStorage("Matches") || [];

    matches.push(match);

    saveToLocalStorage("Matches", matches);

    displayMatches();
  }
}

function displayMatches() {
  matchDiv.innerHTML = "";
  let matches = getFromLocalStorage("Matches");
  matches.forEach((match) => {
    const card = createCard(match);

    matchDiv.append(card);

    card.style.backgroundColor = "#f987cd";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "center";
    card.style.width = "150px";
    card.style.margin = "20px";
    card.style.padding = "10px";
  });
  matchDiv.style.display = "flex";
}

window.onload = () => {
  createUserProfile(localUser, profileDiv);

  applyFilterBtn.addEventListener("click", () => {
    getFilters();
  });

  removeFilterBtn.addEventListener("click", async () => {
    localStorage.removeItem("Filters");
    const person = await createRandomObject();
    displayRandomPerson(person, randomPersonDiv);
  });

  checkLocalStorage();
};
