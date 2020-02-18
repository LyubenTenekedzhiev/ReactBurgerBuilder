import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuildertwo.firebaseio.com/'
});

export default instance;