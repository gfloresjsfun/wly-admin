import axios from 'axios';

export const getSignedUrl = async (key: string) => {
  const response = await axios.get<string>(`/api/s3/signed-url/${encodeURIComponent(key)}`);

  return response.data;
};
