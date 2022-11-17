import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AlbumCardList from 'sections/albums/AlbumCardList';
import { getAlbums } from '_api/albums';

const Albums: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: () => getAlbums() });

  return <>{isLoading ? <CircularProgress /> : <AlbumCardList data={data} />}</>;
};

export default Albums;
