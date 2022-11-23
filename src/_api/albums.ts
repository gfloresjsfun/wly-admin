import axios from 'axios';
import { MutationFunction } from '@tanstack/react-query';
import { IAlbum, AlbumCreateMutationFnVariables, AlbumUpdateMutationFnVariables } from 'types/albums';

export const getAlbums = async () => {
  const response = await axios.get<IAlbum[]>('/api/albums');

  return response.data;
};

export const createAlbum: MutationFunction<IAlbum, AlbumCreateMutationFnVariables> = async ({ title, cover, shows }) => {
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

export const updateAlbum: MutationFunction<IAlbum, AlbumUpdateMutationFnVariables> = async ({ id, title, cover, shows }) => {
  const formData = new FormData();

  formData.append('title', title);
  if (cover) {
    formData.append('cover', cover);
  }

  for (let show of shows) {
    formData.append('shows', show);
  }

  const response = await axios.patch(`/api/admin/albums/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

export const deleteAlbum = async (id: string) => {
  const response = await axios.delete<IAlbum>(`/api/admin/albums/${id}`);

  return response.data;
};
