import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Grid, IconButton, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ShowCard from 'components/cards/ShowCard';
import MainCard from 'components/MainCard';
import { IShow } from 'types/shows';

const ShowCardList: React.FC<{ items: IShow[] }> = ({ items }) => {
  const theme = useTheme();
  const itemEls = useMemo(
    () =>
      items.map((item) => (
        <Grid key={item.id} item xs={12} sm={6} md={4}>
          <ShowCard {...item} />
        </Grid>
      )),
    [items]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
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
            <AddOutlinedIcon sx={{ fontSize: '6rem' }} />
          </IconButton>
        </MainCard>
      </Grid>
      {itemEls}
    </Grid>
  );
};

export default ShowCardList;
