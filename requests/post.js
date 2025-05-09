export async function postUser(url, user) {
  try {
    const response = await axios.post(url, user);
    console.log("New user added:", response.data);
    return response.data;
  } catch (error) {
    console.log("Unable to add new user", error);
    return null;
  }
}
