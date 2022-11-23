import { IShow } from 'types/shows';

export interface IAlbum {
  id: string;
  title: string;
  coverS3Url: string;
  shows: IShow[];
}

export interface AlbumCreateMutationFnVariables {
  title: string;
  cover: File;
  shows: string[];
}

export interface AlbumUpdateMutationFnVariables {
  id: string;
  title: string;
  cover: File;
  shows: string[];
}

export type AlbumMutationFnVariables = AlbumCreateMutationFnVariables | AlbumUpdateMutationFnVariables;

export interface AlbumCardProps {
  item: IAlbum;
  onDelete: (id: string) => void;
}

export interface AlbumCardListProps {
  items: IAlbum[];
  onDeleteItem: (id: string) => void;
}