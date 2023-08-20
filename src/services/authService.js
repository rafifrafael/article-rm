import axios from 'axios';
import config from '../config/config';

export default {
  async isLoggedIn() {
    try {
      const token = localStorage.getItem('user-token');
      if (!token) return false;

      const response = await axios.post('http://localhost:8080/auth/verify-token', { token });
      return response.data.isValid;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        location.reload();
      }
      return false;
    }
  }
};