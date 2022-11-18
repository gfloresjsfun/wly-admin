import { AddOutlined } from '@mui/icons-material';
import { Grid, useTheme, IconButton } from '@mui/material';
import AlbumCard from 'components/cards/AlbumCard';
import MainCard from 'components/MainCard';
import { Link } from 'react-router-dom';
import { IAlbum } from 'types/albums';

const AlbumCardList: React.FC<{ data: IAlbum[] }> = ({ data }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} sm={4} md={3}>
        <MainCard
          sx={{
            border: `1px dashed ${theme.palette.secondary.main}`,
            height: '100%',
            '&:hover': { opacity: 0.72, cursor: 'pointer' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.secondary.main
          }}
        >
          <IconButton
            component={Link}
            to="create"
            sx={{ borderRadius: '50%', border: `1px dashed ${theme.palette.secondary.main}`, width: 'auto', height: 'auto' }}
          >
            <AddOutlined sx={{ fontSize: '6rem' }} />
          </IconButton>
        </MainCard>
      </Grid>
      {data.map((album) => (
        <Grid key={album.id} item xs={6} sm={4} md={3}>
          <AlbumCard {...album} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumCardList;
