import { IShow } from 'types/shows';

export interface IAlbum {
  id: string;
  title: string;
  coverS3Url: string;
  shows: [IShow];
}

export interface NewAlbum {
  cover: File;
  title: string;
  shows: string[];
}

export interface AlbumCardProps extends IAlbum {}
