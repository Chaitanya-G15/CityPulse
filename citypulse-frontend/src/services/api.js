import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchReports = async () => {
  const res = await axios.get(`${API_URL}/reports`);
  return res.data;
};

export const addReport = async (report) => {
  const res = await axios.post(`${API_URL}/report`, report);
  return res.data;
};
