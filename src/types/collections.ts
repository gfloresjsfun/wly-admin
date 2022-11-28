import { IAlbum } from './albums';
import { IShow } from './shows';

export enum PlayableType {
  Show = 'Show',
  Album = 'Album'
}

type IPlayable =
  | {
      id: string;
      playable: IShow;
      playableType: PlayableType;
    }
  | {
      id: string;
      playable: IAlbum;
      playableType: PlayableType;
    };

export interface ICollection {
  id: string;
  title: string;
  playables: IPlayable[];
}

export interface CollectionCreateMutationFnVariables {
  title: string;
  playables: { playable: string; playableType: PlayableType }[];
}

export interface CollectionUpdateMutationFnVariables {
  id: string;
  title: string;
  playables: { playable: string; playableType: PlayableType }[];
}

export type CollectionMutationFnVariables = CollectionCreateMutationFnVariables | CollectionUpdateMutationFnVariables;
