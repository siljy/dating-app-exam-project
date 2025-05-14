import { jest } from "@jest/globals";
import { createNewUser, saveToLocalStorage } from "../login.js";

test("saveToLocalStorage saves to localStorage", () => {
  const testUser = { username: "test", password: 123 };
  saveToLocalStorage("Test", testUser);

  expect(JSON.parse(localStorage.getItem("Test"))).toEqual(testUser);
});

test("createNewUser fails if missing password", async () => {
  const username = "test";
  const password = "";
  document.body.innerHTML = `<input id="register-username" value="${username}" />
  <input id="register-password" value="${password}"/>`;

  global.alert = jest.fn();

  await createNewUser();

  expect(global.alert).toHaveBeenCalledWith("Enter username and password");
});
