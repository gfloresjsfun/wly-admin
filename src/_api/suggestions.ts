import { MutationFunction } from '@tanstack/react-query';
import axios from 'axios';
import { ISuggestion, SuggestionCreateMutationFnVariables, SuggestionUpdateMutationFnVariables } from 'types/suggestions';

export const getSuggestions = async () => {
  const response = await axios.get<ISuggestion[]>('/api/suggestions');

  return response.data;
};

export const createSuggestion: MutationFunction<ISuggestion, SuggestionCreateMutationFnVariables> = async ({
  title,
  description,
  playables,
  tips
}) => {
  const response = await axios.post<ISuggestion>('/api/admin/suggestions', { title, description, playables, tips });

  return response.data;
};

export const updateSuggestion: MutationFunction<ISuggestion, SuggestionUpdateMutationFnVariables> = async ({
  id,
  title,
  description,
  playables,
  tips
}) => {
  const response = await axios.put<ISuggestion>(`/api/admin/suggestions/${id}`, { title, description, playables, tips });

  return response.data;
};

export const deleteSuggestion = async (id: string) => {
  const response = await axios.delete<ISuggestion>(`/api/admin/suggestions/${id}`);

  return response.data;
};
