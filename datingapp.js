import { userUrl } from "./config/auth.js";
import { saveToLocalStorage } from "./login.js";
import { getGender, getRandomUser } from "./requests/get.js";
import { editUser } from "./requests/put.js";

function getFromLocalStorage(key) {
  let localData = JSON.parse(localStorage.getItem(key));
  return localData;
}

//User profile
const profileDiv = document.getElementById("user-profile");

async function createUserProfile() {
  const localUser = getFromLocalStorage("User");

  const title = document.createElement("h2");
  title.innerHTML = "Your profile";
  const profileUsername = document.createElement("h3");
  profileUsername.innerHTML = localUser.username;

  const profilePassword = document.createElement("p");
  profilePassword.innerHTML = `Password: ${localUser.password}`;

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit profile";
  editBtn.addEventListener("click", () => {
    updateUserProfile();
  });

  profileDiv.append(title, profileUsername, profilePassword, editBtn);
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
  createUserProfile();
}

//Finding a match
let randomPersonDiv = document.getElementById("random-person-display");

async function createRandomObject() {
  const randomPerson = await getRandomUser();

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

  randomPersonDiv.append(displayName, displayImg, displayAge, displayLocation);
}

async function checkLocalStorage() {
  let localPerson = getFromLocalStorage("Random person");
  if (localPerson) {
    //Display person from localStorage
    displayRandomPerson(localPerson);
  } else {
    const filters = getFromLocalStorage("Filters");
    if (filters) {
      filterPeople(filters.gender);
    } else {
      //No filters and no person, create random
      const person = await createRandomObject();
      displayRandomPerson(person);
    }
  }
}

const applyFilterBtn = document.getElementById("apply-filters");
applyFilterBtn.addEventListener("click", () => {
  getFilters();
});

async function getFilters() {
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
    console.log("Selected filters", filters.gender);
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

createUserProfile();
checkLocalStorage();
