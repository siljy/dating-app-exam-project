export async function editUser(url, id, updatedData) {
  try {
    const response = await axios.put(`${url}/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Updated user information", response.data);
  } catch (error) {
    console.log("Failed updating user", error.response.data);
  }
}
