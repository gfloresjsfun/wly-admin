import { MutationFunction } from '@tanstack/react-query';
import axios from 'axios';
import { ICollection, CollectionCreateMutationFnVariables, CollectionUpdateMutationFnVariables } from 'types/collections';

export const getCollections = async () => {
  const response = await axios.get<ICollection[]>('/api/collections');

  return response.data;
};

export const createCollection: MutationFunction<ICollection, CollectionCreateMutationFnVariables> = async ({ title, playables }) => {
  const response = await axios.post<ICollection>('/api/admin/collections', { title, playables });

  return response.data;
};

export const updateCollection: MutationFunction<ICollection, CollectionUpdateMutationFnVariables> = async ({ id, title, playables }) => {
  const response = await axios.put<ICollection>(`/api/admin/collections/${id}`, { title, playables });

  return response.data;
};

export const deleteCollection = async (id: string) => {
  const response = await axios.delete<ICollection>(`/api/admin/collections/${id}`);

  return response.data;
};
