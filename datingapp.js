import { userUrl } from "./config/auth.js";
import { getDataFromCrudCrud } from "./requests/get.js";

const profileDiv = document.getElementById("user-profile");

function getFromLocalStorage() {
  let localUser = localStorage.getItem("User");
  localUser = JSON.parse(localUser);
  return localUser;
}

function createUserProfile() {
  const localUser = getFromLocalStorage();

  const profileUsername = document.createElement("h2");
  profileUsername.innerHTML = localUser.username;

  const profilePassword = document.createElement("p");
  profilePassword.innerHTML = `Passord: ${localUser.password}`;

  const editUsername = document.createElement("button");
  editUsername.innerHTML = "Edit username";

  const editPassword = document.createElement("button");
  editPassword.innerHTML = "Edit password";

  profileDiv.append(
    profileUsername,
    profilePassword,
    editUsername,
    editPassword
  );
}

createUserProfile();
