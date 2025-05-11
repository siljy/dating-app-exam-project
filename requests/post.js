export async function postPerson(url, user) {
  try {
    const response = await axios.post(url, user);
    console.log("Posted to crud", response.data);
    return response.data;
  } catch (error) {
    console.log("Unable to post to crud", error);
    return null;
  }
}
