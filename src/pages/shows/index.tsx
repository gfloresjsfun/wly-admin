import { useState, useCallback, useMemo } from 'react';
import { CircularProgress, Stack, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import Create from 'sections/shows/CreateDialog';
import { getShows } from '_api/shows';
import { useMatch, useNavigate } from 'react-router';
import EditDialog from 'sections/shows/EditDialog';
import ShowCardList from 'sections/shows/ShowCardList';
import MainCard from 'components/MainCard';
import useDeferredValue from 'hooks/utils/useDeferredValue';

const Shows: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  const navigate = useNavigate();
  const createOpen = !!useMatch('/shows/create');
  const editId = useMatch('/shows/:id/edit')?.params.id;
  const handleClose = useCallback(() => {
    navigate('/shows');
  }, [navigate]);

  const editItem = useMemo(() => data.find(({ id }) => id === editId), [editId, data]);

  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  const items = useMemo(
    () => data.filter((item) => item.title.toLocaleLowerCase().includes(deferredQ.toLocaleLowerCase())),
    [data, deferredQ]
  );

  return (
    <Stack gap={3}>
      <MainCard>
        <OutlinedInput startAdornment={<SearchIcon />} value={q} onChange={(e) => setQ(e.target.value)} />
      </MainCard>

      {isLoading ? <CircularProgress /> : <ShowCardList items={items} />}
      {createOpen && <Create open={createOpen} onClose={handleClose} />}
      {!!editId && editItem && <EditDialog open={!!editId} onClose={handleClose} item={editItem} />}
    </Stack>
  );
};

export default Shows;
