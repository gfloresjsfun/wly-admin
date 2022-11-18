import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMatch, useNavigate } from 'react-router';
import AlbumCardList from 'sections/albums/AlbumCardList';
import AlbumDialog from 'sections/albums/AlbumDialog';
import { getAlbums } from '_api/albums';

const Albums: React.FC = () => {
  const dialogOpen = useMatch('/albums/create');
  const navigate = useNavigate();

  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: () => getAlbums() });

  return (
    <>
      {isLoading ? <CircularProgress /> : <AlbumCardList items={data} />}

      {dialogOpen && <AlbumDialog open={!!dialogOpen} onClose={() => navigate('/albums')} />}
    </>
  );
};

export default Albums;
