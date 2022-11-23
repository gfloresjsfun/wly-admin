import { MutationFunction } from '@tanstack/react-query';
import axios from 'axios';
import { IShow, ShowCreateMutationFnVariables, ShowUpdateMutationFnVariables } from 'types/shows';

export const getShows = async () => {
  const response = await axios.get<IShow[]>('/api/shows');

  return response.data;
};

export const createShow: MutationFunction<IShow, ShowCreateMutationFnVariables> = async ({ title, cover, media }) => {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('cover', cover);
  formData.append('media', media);

  const response = await axios.post<IShow>('/api/admin/shows', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

export const updateShow: MutationFunction<IShow, ShowUpdateMutationFnVariables> = async ({ id, title, cover, media }) => {
  const formData = new FormData();

  formData.append('title', title);
  if (cover) formData.append('cover', cover);
  if (media) formData.append('media', media);

  const response = await axios.patch<IShow>(`/api/admin/shows/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return response.data;
};

export const deleteShow = async (id: string) => {
  const response = await axios.delete<IShow>(`/api/admin/shows/${id}`);

  return response.data;
};
