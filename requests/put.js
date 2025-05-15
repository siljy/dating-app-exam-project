export async function editUser(url, id, updatedData) {
  try {
    const response = await axios.put(`${url}/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Updated user information", response);
  } catch (error) {
    console.log("Failed updating user", error);
  }
}
