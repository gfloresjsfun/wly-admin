import { useCallback, useState } from 'react';
import { Box, CircularProgress, OutlinedInput, Button } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import MainCard from 'components/MainCard';
import ShowsTable from 'sections/shows/ShowsTable';
import ShowDialog from 'sections/shows/ShowDialog';
import { getShows } from '_api/shows';
import useDeferredValue from 'hooks/utils/useDeferredValue';

const Shows: React.FC = () => {
  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  console.log('deferredQ :', deferredQ);
  const { isLoading, data = [] } = useQuery({ queryKey: ['shows', deferredQ], queryFn: () => getShows(q) });

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <>
      <MainCard>
        <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <OutlinedInput id="start-adornment-email" startAdornment={<Search />} value={q} onChange={(e) => setQ(e.target.value)} />

          <Button variant="contained" onClick={handleOpen}>
            <Add />
            Add Item
          </Button>

          {dialogOpen && <ShowDialog open={dialogOpen} onClose={handleClose} />}
        </Box>
      </MainCard>

      {isLoading ? <CircularProgress /> : <ShowsTable data={data} />}
    </>
  );
};

export default Shows;
