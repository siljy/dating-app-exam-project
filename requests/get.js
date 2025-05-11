import { randomUserUrl } from "../config/auth.js";

//GET from CrudCrud
export async function getDataFromCrudCrud(url) {
  try {
    const response = await axios.get(url);
    console.log("User data from CrudCrud:", response.data);
    return response.data;
  } catch (error) {
    console.log("Unable to fetch data from CrudCrud", error);
  }
}

//GET from randomuser.api
export async function getRandomUser() {
  try {
    const response = await axios.get(randomUserUrl);
    console.log("Fetched random person", response.data.results);
    return response.data.results;
  } catch (error) {
    console.log("Unable to fetch from randomuser.api", error);
  }
}

export async function getGender(gender) {
  try {
    const response = await axios.get(
      `https://randomuser.me/api/?gender=${gender}&results=10`
    );
    console.log("Fetched person by gender", response.data.results);
    return response.data.results;
  } catch (error) {
    console.log("Unable to fetch from randomuser.api", error);
  }
}
