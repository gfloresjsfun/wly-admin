import { Box, CircularProgress, OutlinedInput } from '@mui/material';
import MainCard from 'components/MainCard';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { Add, Search } from '@mui/icons-material';
import ShowsTable from 'sections/shows/table';
import { useQuery } from '@tanstack/react-query';
import { getShows } from '_api/shows';
import ShowDialog from 'sections/shows/Dialog';

const Shows: React.FC = () => {
  const [q, setQ] = useState('');
  const { isLoading, data = [] } = useQuery({ queryKey: ['shows'], queryFn: getShows });

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
