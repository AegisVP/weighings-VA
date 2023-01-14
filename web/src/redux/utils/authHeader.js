import axios from 'axios';

export const authHeader = {
  set: token => (axios.defaults.headers.common.Authorization = `Bearer ${token}`),
  clear: () => (axios.defaults.headers.common.Authorization = null),
};
