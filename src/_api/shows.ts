import axios from 'axios';
import { IShow, NewShow } from 'types/shows';

export const getShows = async (q: string) => {
  const response = await axios.get<IShow[]>('/api/shows', { params: { q } });

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
