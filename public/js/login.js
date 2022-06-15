import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:4000/api/v1/users/login',
      data: { email: email, password: password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
