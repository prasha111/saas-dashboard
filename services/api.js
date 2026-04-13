const BASE_URL = "http://localhost:5000";

export const getSites = async () => {
  const res = await fetch(`${BASE_URL}/sites`);
  return res.json();
};