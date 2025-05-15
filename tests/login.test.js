import { describe, jest } from "@jest/globals";
import { createNewUser, saveToLocalStorage } from "../login.js";

test("saveToLocalStorage saves to localStorage", () => {
  const testUser = { username: "test", password: 123 };
  saveToLocalStorage("Test", testUser);

  expect(JSON.parse(localStorage.getItem("Test"))).toEqual(testUser);
});

describe("Testing createNewUser", () => {
  let username = "test";
  let password = "123";

  //Mocking alert with jest:
  //https://stackoverflow.com/questions/55933105/how-to-mock-or-assert-whether-window-alert-has-fired-in-react-jest-with-typesc
  global.alert = jest.fn();

  document.body.innerHTML = `<input id="register-username" value="${username}" />
    <input id="register-password" value="${password}"/>`;

  test("createNewUser succeeds", async () => {
    await createNewUser();

    expect(global.alert).toHaveBeenCalledWith(
      "Successfully created a new user, welcome!"
    );
  });

  test("createNewUser fails if missing password", async () => {
    password = "";

    global.alert = jest.fn();

    await createNewUser();

    expect(global.alert).toHaveBeenCalledWith("Enter username and password");
  });
});
