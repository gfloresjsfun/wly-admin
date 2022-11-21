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

export const updateAlbum = async ({ title, cover, shows, id }: NewAlbum & { id: string }) => {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('cover', cover);

  for (let show of shows) {
    formData.append('shows', show);
  }

  const response = await axios.patch(`/api/admin/albums/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

export const deleteAlbum = async (id: string) => {
  return await axios.delete(`/api/admin/albums/${id}`);
};
