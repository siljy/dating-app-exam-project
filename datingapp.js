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

function getFromLocalStorage(key) {
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
  const newUsername = prompt("New username");
  const newPassword = prompt("New password");

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

//Finding a match
let randomPersonDiv = document.getElementById("random-person-display");

async function createRandomObject() {
  const randomPerson = await getRandomUser();
  console.log("hei", randomPerson);
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

async function displayRandomPerson(person) {
  randomPersonDiv.innerHTML = "";
  const displayName = document.createElement("h3");
  displayName.innerHTML = person.name;

  const displayImg = document.createElement("img");
  displayImg.src = person.img;

  const displayAge = document.createElement("h4");
  displayAge.innerHTML = person.age;

  const displayLocation = document.createElement("p");
  displayLocation.innerHTML = person.location;

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

  randomPersonDiv.append(
    displayName,
    displayImg,
    displayAge,
    displayLocation,
    noBtn,
    yesBtn
  );
}

async function checkLocalStorage() {
  let localPerson = getFromLocalStorage("Random person");
  if (localPerson) {
    displayRandomPerson(localPerson);
  } else {
    const filters = getFromLocalStorage("Filters");
    if (filters) {
      filterPeople(filters.gender);
    } else {
      const person = await createRandomObject();
      displayRandomPerson(person);
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

function getFilters() {
  let selectedAgeRange = document.getElementById("age-range").value;
  let selectedGenderRadio = document.querySelector(
    'input[name="gender"]:checked'
  );

  if (!selectedGenderRadio) {
    alert("Select women, men or both");
  } else {
    let selectedGender = selectedGenderRadio.value;
    let filters = {
      age: selectedAgeRange,
      gender: selectedGender,
    };
    saveToLocalStorage("Filters", filters);
    filterPeople(filters.gender);
  }
}

async function filterPeople(gender) {
  const filters = getFromLocalStorage("Filters");
  const { min, max } = parseAgeRange(filters.age);

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

  displayRandomPerson(matchedPerson);
}

function parseAgeRange(range) {
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
    filterPeople(filters.gender);
  } else {
    const person = await createRandomObject();
    displayRandomPerson(person);
  }
}

let savedDiv = document.getElementById("favorites");
//Extra feature
let counter = 0;

async function swipeYes(person) {
  await postPerson(favUrl, person);
  updateLocalFavorite();
  newPerson();

  //Extra feature
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
  savedPeople.forEach((person) => {
    const favoriteCard = document.createElement("div");

    const displayName = document.createElement("h3");
    displayName.innerHTML = person.name;

    const displayImg = document.createElement("img");
    displayImg.src = person.img;

    const displayAge = document.createElement("h4");
    displayAge.innerHTML = person.age;

    const displayLocation = document.createElement("p");
    displayLocation.innerHTML = person.location;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await deleteFromCrudCrud(favUrl, person._id);
      updateLocalFavorite();
    });

    favoriteCard.append(
      displayName,
      displayImg,
      displayAge,
      displayLocation,
      deleteBtn
    );
    savedDiv.append(favoriteCard);
  });
}

//Extra feature: Randomly match with favorites
function randomNumber(min, max) {
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

    console.log("matches", matches);
    saveToLocalStorage("Matches", matches);

    displayMatches();
  }
}

function displayMatches() {
  matchDiv.innerHTML = "";
  let matches = getFromLocalStorage("Matches");
  matches.forEach((match) => {
    const matchCard = document.createElement("div");
    const displayName = document.createElement("h3");
    displayName.innerHTML = match.name;

    const displayImg = document.createElement("img");
    displayImg.src = match.img;

    const displayAge = document.createElement("h4");
    displayAge.innerHTML = match.age;

    const displayLocation = document.createElement("p");
    displayLocation.innerHTML = match.location;

    matchCard.append(displayName, displayImg, displayAge, displayLocation);
    matchDiv.append(matchCard);

    matchDiv.style.display = "flex";

    matchCard.style.backgroundColor = "pink";
    matchCard.style.display = "flex";
    matchCard.style.flexDirection = "column";
    matchCard.style.justifyContent = "center";
    matchCard.style.width = "150px";
    matchCard.style.margin = "20px";
    matchCard.style.padding = "10px";
  });
}

window.onload = () => {
  createUserProfile(localUser, profileDiv);

  applyFilterBtn.addEventListener("click", () => {
    getFilters();
  });

  checkLocalStorage();
};
