import { ISuggestion } from './suggestions';

export interface IPainPoint {
  id: string;
  name: string;
  description: string;
  group: string | undefined;
  suggestions: ISuggestion[];
}

export interface PainPointCreateMutationFnVariables {
  name: string;
  description: string;
  group: string;
  suggestions: string[];
}

export interface PainPointUpdateMutationFnVariables {
  id: string;
  name: string;
  description: string;
  group: string;
  suggestions: string[];
}

export type PainPointMutationFnVariables = PainPointCreateMutationFnVariables | PainPointUpdateMutationFnVariables;
