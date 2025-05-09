export async function getDataFromCrudCrud(url) {
  try {
    const response = await axios.get(url);
    console.log("User data from CrudCrud:", response.data);
    return response.data;
  } catch (error) {
    console.log("Unable to fetch data from CrudCrud", error);
  }
}
