import axios from 'axios';
import { IAlbum } from 'types/albums';

export const getAlbums = async () => {
  const response = await axios.get<IAlbum[]>('/api/albums');

  return response.data;
};
