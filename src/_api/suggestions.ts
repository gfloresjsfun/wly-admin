import axios from 'axios';
import { ISuggestion } from 'types/suggestions';

export const getSuggestions = async () => {
  const response = await axios.get<ISuggestion[]>('/api/suggestions');

  return response.data;
};
