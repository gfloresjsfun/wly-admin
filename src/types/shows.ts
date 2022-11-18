export interface IShow {
  id: string;
  title: string;
  mediaS3Key: string;
  coverS3Url: string;
  duration: number;
  mimetype: string;
}

export interface ShowCardProps extends IShow {}

export interface NewShow {
  title: string;
  media: File;
  cover: File;
}
