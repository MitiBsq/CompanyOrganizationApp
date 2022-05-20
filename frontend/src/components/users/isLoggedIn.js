//Custom hook for checking if the user has logged in the last 12 hours using jwt
export async function isLoggedIn() {
  try {
    const response = await fetch("http://localhost:5000/api/checkLogin", {
      method: "GET",
      headers: { token: localStorage.jwtToken }
    });
    const jsonResponse = await response.json();
    if (response.status === 200) {
      //If the status is 200 this means the token is good and we send back the email
      return jsonResponse;
    }
    return false;
  } catch (error) {
    console.error(error.message);
  }
}