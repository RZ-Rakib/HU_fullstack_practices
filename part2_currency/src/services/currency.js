import axios from 'axios';
const api_key = import.meta.env.VITE_EXCHANGE_API_KEY;
const BaseURL = `https://v6.exchangerate-api.com/v6/${api_key}`;

const getCurrency = (currency) => {
  return axios
    .get(`${BaseURL}/latest/${currency}`)
    .then((response) => response.data);
};

export default { getCurrency };
