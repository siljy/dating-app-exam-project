export async function deleteFromCrudCrud(url, id) {
  try {
    const response = await axios.delete(`${url}/${id}`);
    console.log("Deleted from CrudCrud:", response.status);
  } catch (error) {
    console.log("Unable to delete data from CrudCrud", error);
  }
}
