import { userUrl } from "../config/auth.js";

export async function postUser(user) {
  try {
    const response = await axios.post(userUrl, user);
    console.log("New user added:", response.data);
  } catch (error) {
    console.log("Unable to add new user", error);
  }
}
