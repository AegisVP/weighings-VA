import { constants } from '../constants/constants';
import axios from 'axios';

axios.defaults.baseURL = `${constants.BASE_URL}/api`;
