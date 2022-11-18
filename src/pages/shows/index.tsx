import { useCallback, useMemo } from 'react';
import { Box, CircularProgress, OutlinedInput, Button } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import MainCard from 'components/MainCard';
import ShowsTable from 'sections/shows/ShowTable';
import Create from 'sections/shows/CreateDialog';
import { getShows } from '_api/shows';
import { useMatch, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import EditDialog from 'sections/shows/EditDialog';

const Shows: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  const navigate = useNavigate();
  const createOpen = !!useMatch('/shows/create');
  const editId = useMatch('/shows/:id/edit')?.params.id;
  const handleClose = useCallback(() => {
    navigate('/shows');
  }, [navigate]);

  const editItem = useMemo(() => data.find(({ id }) => id === editId), [editId, data]);

  return (
    <>
      <MainCard>
        <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <OutlinedInput id="start-adornment-email" startAdornment={<Search />} />

          <Button variant="contained" component={Link} to="create">
            <Add />
            Add Item
          </Button>

          {createOpen && <Create open={createOpen} onClose={handleClose} />}
          {!!editId && editItem && <EditDialog open={!!editId} onClose={handleClose} item={editItem} />}
        </Box>
      </MainCard>

      {isLoading ? <CircularProgress /> : <ShowsTable data={data} />}
    </>
  );
};

export default Shows;
