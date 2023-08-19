import axios from 'axios';

export default {
  async isLoggedIn() {
    try {
      const token = localStorage.getItem('user-token'); // Fetch the token from storage
      if (!token) return false;

      const response = await axios.post('http://localhost:8080/auth/verify-token', { token }); // Replace with your backend's route
      return response.data.isValid; // Assumes the backend responds with an object containing an "isValid" key
    } catch (error) {
      if (error.response && error.response.status === 401) {
        location.reload();
      }
      return false;
    }
  }
};