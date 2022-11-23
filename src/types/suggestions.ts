import { IAlbum } from './albums';
import { IShow } from './shows';

interface ITip {
  summary: string;
  details: string;
}

enum PlayableType {
  Show = 'Show',
  Album = 'Album'
}

interface IPlayable {
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
