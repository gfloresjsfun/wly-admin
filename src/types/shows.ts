export interface IShow {
  id: string;
  title: string;
  mediaS3Key: string;
  coverS3Url: string;
  duration: number;
  mimetype: string;
}

export interface ShowCreateMutationFnVariables {
  title: string;
  media: File;
  cover: File;
}

export interface ShowUpdateMutationFnVariables {
  id: string;
  title: string;
  media?: File;
  cover?: File;
}

export type ShowMutationFnVariables = ShowCreateMutationFnVariables | ShowUpdateMutationFnVariables

export interface ShowCardProps {
  item: IShow;
  onDelete: (id: string) => void;
}

export interface ShowCardListProps {
  items: IShow[];
  onDeleteItem: (id: string) => void;
}
