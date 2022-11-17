import { IShow } from 'types/shows';

export interface IAlbum {
  id: string;
  title: string;
  coverS3Url: string;
  shows: [IShow];
}