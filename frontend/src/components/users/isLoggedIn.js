//Custom hook for checking if the user has logged in the last 12 hours using jwt
export async function isLoggedIn() {
  try {
    const response = await fetch("http://localhost:5000/api/checkLogin", {
      method: "GET",
      headers: { token: localStorage.jwtToken }
    });
    const jsonResponse = await response.json();
    if (jsonResponse) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error.message);
  }
}