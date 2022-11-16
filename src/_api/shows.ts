import axios from 'axios';
import { IShow } from 'types/shows';

export const getShows = async () => {
  const response = await axios.get<IShow[]>('/api/shows');

  return response.data;
};
