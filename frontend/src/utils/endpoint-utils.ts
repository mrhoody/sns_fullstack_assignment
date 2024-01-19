export async function postEndpointHelper(
  endpoint: string,
  requestData?: { [key: string]: any }
) {
  // sends a POST request to the selected endpoint and appends the formdata to the request
  // sends the request as multipart/form-data to enable file uploads to FastApi
  const formData = new FormData();
  const endpointUrl = `api/${endpoint}`;
  // append the requestData to the request
  for (const key in requestData) {
    formData.append(key, requestData[key]);
  }

  // form the request
  const response = await fetch(endpointUrl, {
    method: "POST",
    body: formData,
  }); // TODO: resolve the response

  return response;
}

export async function getEndpointHelper(endpoint: string) {
  // sends a GET request to the selected endpoint
  // you can't append a form body to a get request
  const endpointUrl = `api:5000/`;
  // form the request
  const response = await fetch(endpointUrl, {
    method: "GET",
  });
  const responseJson = await response.json();
  return responseJson;
}
