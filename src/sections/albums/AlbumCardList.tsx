import { Grid } from '@mui/material';
import AlbumCard from 'components/cards/AlbumCard';
import { IAlbum } from 'types/albums';

const AlbumCardList: React.FC<{ data: IAlbum[] }> = ({ data }) => {
  return (
    <Grid container spacing={3}>
      {data.map((album) => (
        <Grid key={album.id} item xs={6} sm={4} md={3}>
          <AlbumCard {...album} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumCardList;
