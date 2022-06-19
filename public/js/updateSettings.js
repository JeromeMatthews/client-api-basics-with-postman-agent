import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:4000/api/v1/users/updateMe',
      data: { name, email },
    });

    if (res.status === 'success') {
      showAlert('success', 'User account successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
