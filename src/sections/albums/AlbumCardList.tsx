import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Grid, useTheme, IconButton } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AlbumCard from 'components/cards/AlbumCard';
import MainCard from 'components/MainCard';
import { IAlbum } from 'types/albums';

const AlbumCardList: React.FC<{ items: IAlbum[]; onDeleteItem: (id: string) => void }> = ({ items, onDeleteItem }) => {
  const theme = useTheme();
  const itemEls = useMemo(
    () =>
      items.map((item) => (
        <Grid key={item.id} item xs={6} sm={4} md={3}>
          <AlbumCard item={item} onDelete={onDeleteItem} />
        </Grid>
      )),
    [items]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} sm={4} md={3}>
        <MainCard
          sx={{
            border: `1px dashed ${theme.palette.secondary.main}`,
            height: 300,
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
            <AddOutlinedIcon sx={{ fontSize: '6rem' }} />
          </IconButton>
        </MainCard>
      </Grid>
      {itemEls}
    </Grid>
  );
};

export default AlbumCardList;
