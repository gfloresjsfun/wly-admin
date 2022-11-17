import axios from 'axios';
import { IShow, NewShow } from 'types/shows';

export const getShows = async () => {
  const response = await axios.get<IShow[]>('/api/shows');

  return response.data;
};

export const createShow = async ({ title, cover, media }: NewShow) => {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('cover', cover);
  formData.append('media', media);

  const response = await axios.post<IShow>('/api/admin/shows', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

interface UpdateShow {
  id: string;
  title: string;
  media?: File;
  cover?: File;
}

export const updateShow = async ({ title, cover, media, id }: UpdateShow) => {
  const formData = new FormData();

  formData.append('title', title);
  if (cover) formData.append('cover', cover);
  if (media) formData.append('media', media);

  const response = await axios.patch<IShow>(`/api/admin/shows/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

export const deleteShow = async (id: string) => axios.delete(`/api/admin/shows/${id}`);
