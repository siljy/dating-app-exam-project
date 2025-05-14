import { userUrl } from "./config/auth.js";
import { getDataFromCrudCrud } from "./requests/get.js";
import { postPerson } from "./requests/post.js";

async function compareUserDatabase(username, password) {
  const userDatabase = await getDataFromCrudCrud(userUrl);

  const usernameFromCrud = userDatabase.find(
    (user) => user.username === username
  );

  if (!usernameFromCrud) {
    alert("No user found, please create a new user");
  } else if (usernameFromCrud.password !== password) {
    alert("Wrong password, try again");
  } else {
    const userFromCrud = {
      _id: usernameFromCrud._id,
      username: username,
      password: password,
    };

    saveToLocalStorage("User", userFromCrud);
    alert("Successfully logged in, welcome!");
    setTimeout(() => {
      window.location.href = "datingapp.html";
    }, 3000);
  }
}

export function saveToLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

export async function loginToPage() {
  const username = document.getElementById("login-username");
  const password = document.getElementById("login-password");

  if (!username.value || !password.value) {
    alert("Enter username and password");
  } else {
    compareUserDatabase(username.value, password.value);
    username.value = "";
    password.value = "";
  }
}

window.onload = () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("register-username");
    const password = document.getElementById("register-password");

    if (!username.value || !password.value) {
      alert("Enter username and password");
    } else {
      const newUser = { username: username.value, password: password.value };

      const createdUser = await postPerson(userUrl, newUser);
      if (createdUser) {
        saveToLocalStorage("User", createdUser);
      }

      username.value = "";
      password.value = "";

      alert("Successfully created a new user, welcome!");

      setTimeout(() => {
        window.location.href = "datingapp.html";
      }, 3000);
    }
  });
  const loginForm = document.getElementById("login");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginToPage();
  });
};
