import { userUrl } from "./config/auth.js";
import { saveUserToLocalStorage } from "./login.js";
import { getDataFromCrudCrud } from "./requests/get.js";
import { editUser } from "./requests/put.js";

const profileDiv = document.getElementById("user-profile");

function getFromLocalStorage(key) {
  let localUser = JSON.parse(localStorage.getItem(key));
  return localUser;
}

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
  saveUserToLocalStorage("User", updatedCrudUser);
  profileDiv.innerHTML = "";
  createUserProfile();
}

createUserProfile();
