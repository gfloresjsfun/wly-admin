import { useMemo, useState } from 'react';
import { CircularProgress, Stack, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useMatch, useNavigate } from 'react-router';
import MainCard from 'components/MainCard';
import AlbumCardList from 'sections/albums/AlbumCardList';
import AlbumDialog from 'sections/albums/AlbumDialog';
import { getAlbums } from '_api/albums';
import useDeferredValue from 'hooks/utils/useDeferredValue';

const Albums: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: () => getAlbums() });
  const createOpen = useMatch('/albums/create');
  const navigate = useNavigate();

  const editId = useMatch('/albums/:id/edit')?.params.id;
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

      {isLoading ? <CircularProgress /> : <AlbumCardList items={items} />}
      {createOpen && <AlbumDialog open onClose={() => navigate('/albums')} />}
      {editId && editItem && <AlbumDialog open edit item={editItem} onClose={() => navigate('/albums')} />}
    </Stack>
  );
};

export default Albums;
