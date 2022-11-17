import axios from 'axios';

export const getSignedUrl = (key: string) => axios.get<string>(`/api/s3/signed-url/${encodeURIComponent(key)}`);
