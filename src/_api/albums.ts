import axios from 'axios';
import { IAlbum, NewAlbum } from 'types/albums';

export const getAlbums = async () => {
  const response = await axios.get<IAlbum[]>('/api/albums');

  return response.data;
};

export const createAlbum = async ({ title, cover, shows }: NewAlbum) => {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('cover', cover);

  for (let show of shows) {
    formData.append('shows', show);
  }

  const response = await axios.post<IAlbum>('/api/admin/albums', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
