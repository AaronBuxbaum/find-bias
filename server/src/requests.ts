import axios from 'axios';

export default axios.create({
  baseURL: 'http://nlp:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});
