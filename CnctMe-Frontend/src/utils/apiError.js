const getApiError = (error) => {
  const errorObject = {};

  if (!error.response) {
    errorObject.general = "Unable to connect to the server. Please try again.";

    return errorObject;
  }

  const responseData = error.response.data;

  if (Array.isArray(responseData.errors)) {
    responseData.errors.forEach((err) => {
      if (err.path) {
        errorObject[err.path] = err.msg;
      }
    });
  }

  //This handles errors where the backend doesn't send field-specific validation errors.
  if (responseData.message && !responseData.errors) {
    errorObject.general = responseData.message;
  }

  //if the error arrays come empty from backend
  if (!errorObject.general && !Object.keys(errorObject).length) {
    errorObject.general = "Something went wrong. Please try again.";
  }

  return errorObject;
};

export default getApiError;
