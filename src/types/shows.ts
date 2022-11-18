export interface IShow {
  id: string;
  title: string;
  mediaS3Key: string;
  coverS3Url: string;
  duration: number;
  mimetype: string;
}

export interface ShowCardProps {
  item: IShow;
  onDelete: (id: string) => void;
}

export interface ShowCardListProps {
  items: IShow[];
  onDeleteItem: (id: string) => void;
}

export interface NewShow {
  title: string;
  media: File;
  cover: File;
}
