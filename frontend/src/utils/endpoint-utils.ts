export async function postEndpointHelper(
  endpoint: string,
  requestData?: { [key: string]: any }
) {
  // sends a POST request to the selected endpoint and appends the formdata to the request
  // sends the request as multipart/form-data to enable file uploads to FastApi
  const formData = new FormData();
  const endpointUrl = `http://localhost:5000/${endpoint}`;
  // append the requestData to the request
  for (const key in requestData) {
    formData.append(key, requestData[key]);
  }

  // form the request
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}
