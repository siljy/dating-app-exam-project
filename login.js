import { postUser } from "./requests/post.js";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username");
  const password = document.getElementById("password");

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
