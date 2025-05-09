import { userUrl } from "./config/auth.js";
import { getDataFromCrudCrud } from "./requests/get.js";
import { postUser } from "./requests/post.js";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("register-username");
  const password = document.getElementById("register-password");

  if (!username.value || !password.value) {
    alert("Enter username and password");
  } else {
    const newUser = { username: username.value, password: password.value };

    postUser(newUser);

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

  const username = document.getElementById("login-username");
  const password = document.getElementById("login-password");

  if (!username.value || !password.value) {
    alert("Enter username and password");
  } else {
    compareUserDatabase(username.value, password.value);
    username.value = "";
    password.value = "";
  }
});

async function compareUserDatabase(username, password) {
  const userDatabase = await getDataFromCrudCrud(userUrl);

  const usernameFromCrud = userDatabase.find(
    (user) => user.username === username
  );
  const passwordFromCrud = userDatabase.find(
    (user) => user.password === password
  );
  if (usernameFromCrud == null) {
    alert("No user found, please create a new user");
  } else if (passwordFromCrud == null) {
    alert("Wrong password, try again");
  } else {
    setTimeout(() => {
      window.location.href = "datingapp.html";
    }, 3000);
    alert("Successfully logged in, welcome!");
  }
}
