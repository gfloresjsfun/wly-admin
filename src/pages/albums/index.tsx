import { Box, CircularProgress, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import MainCard from 'components/MainCard';
import AlbumTable from 'sections/albums/AlbumTable';
import { getAlbums } from '_api/albums';

const Albums: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: () => getAlbums() });

  return (
    <>
      <MainCard>
        <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Button variant="contained">
            <Add />
            Add Item
          </Button>
        </Box>
      </MainCard>

      {isLoading ? <CircularProgress /> : <AlbumTable data={data} />}
    </>
  );
};

export default Albums;
