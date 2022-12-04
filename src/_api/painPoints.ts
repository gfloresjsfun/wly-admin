import { MutationFunction } from '@tanstack/react-query';
import axios from 'axios';
import { IPainPoint, PainPointCreateMutationFnVariables, PainPointUpdateMutationFnVariables } from 'types/painPoints';

export const getPainPoints = async () => {
  const response = await axios.get<IPainPoint[]>('/api/pain-points');

  return response.data;
};

export const getPainPointGroups = async () => {
  const response = await axios.get<string[]>('/api/admin/pain-points/groups');

  return response.data;
};

export const createPainPoint: MutationFunction<IPainPoint, PainPointCreateMutationFnVariables> = async ({
  name,
  description,
  group,
  suggestions
}) => {
  const response = await axios.post<IPainPoint>('/api/admin/pain-points', { name, description, group, suggestions });

  return response.data;
};

export const updatePainPoint: MutationFunction<IPainPoint, PainPointUpdateMutationFnVariables> = async ({
  id,
  name,
  description,
  group,
  suggestions
}) => {
  const response = await axios.put<IPainPoint>(`/api/admin/pain-points/${id}`, { name, description, group, suggestions });

  return response.data;
};

export const deletePainPoint = async (id: string) => {
  const response = await axios.delete<IPainPoint>(`/api/admin/pain-points/${id}`);

  return response.data;
};
