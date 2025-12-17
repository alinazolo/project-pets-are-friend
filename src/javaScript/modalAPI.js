import axios from 'axios';
import notification from './sweetAlert';

//will be replaced to api.js
axios.defaults.baseURL = 'https://paw-hut.b.goit.study';

export async function postOrder(params) {
  const endpoint = '/api/orders';
  try {
    const res = await axios.post(axios.defaults.baseURL + endpoint, params);
    return res.data;
  } catch (error) {
    notification.errorAlert(error.response?.data?.message);
  }
}
