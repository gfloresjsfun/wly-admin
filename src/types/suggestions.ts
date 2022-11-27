import { IAlbum } from './albums';
import { IShow } from './shows';

export interface ITip {
  summary: string;
  details: string;
}

export enum PlayableType {
  Show = 'Show',
  Album = 'Album'
}

interface IPlayable {
  id: string;
  playable: IShow | IAlbum;
  playableType: PlayableType;
}

export interface ISuggestion {
  id: string;
  title: string;
  description: string;
  playables: IPlayable[];
  tips?: ITip[];
}

export interface SuggestionCreateMutationFnVariables {
  title: string;
  description: string;
  playables: { playable: string; playableType: PlayableType }[];
  tips: ITip[];
}

export interface SuggestionUpdateMutationFnVariables {
  id: string;
  title: string;
  description: string;
  playables: { playable: string; playableType: PlayableType }[];
  tips: ITip[];
}

export type SuggestionMutationFnVariables = SuggestionCreateMutationFnVariables | SuggestionUpdateMutationFnVariables;
