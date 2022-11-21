import { useMemo, useState, useCallback } from 'react';
import { CircularProgress, Stack, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMatch, useNavigate } from 'react-router';
import MainCard from 'components/MainCard';
import AlbumCardList from 'sections/albums/AlbumCardList';
import AlbumDialog from 'sections/albums/AlbumDialog';
import { deleteAlbum, getAlbums } from '_api/albums';
import useDeferredValue from 'hooks/utils/useDeferredValue';
import { useConfirm } from 'material-ui-confirm';
import { IAlbum } from 'types/albums';

const Albums: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: getAlbums });
  const createOpen = useMatch('/albums/create');
  const navigate = useNavigate();

  const editId = useMatch('/albums/:id/edit')?.params.id;
  const editItem = useMemo(() => data.find(({ id }) => id === editId), [editId, data]);

  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const handleDelete = useCallback(
    async (id) => {
      try {
        await confirm({ description: 'Are you sure to delete this item?' });
        await deleteAlbum(id);
        queryClient.setQueriesData(['albums'], (albums: IAlbum[] = []) => [...albums.filter(({ id: showId }) => showId !== id)]);
      } catch (e) {
        console.log(e);
      }
    },
    [confirm, queryClient]
  );

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

      {isLoading ? <CircularProgress /> : <AlbumCardList items={items} onDeleteItem={handleDelete} />}
      {createOpen && <AlbumDialog open onClose={() => navigate('/albums')} />}
      {editId && editItem && <AlbumDialog open edit item={editItem} onClose={() => navigate('/albums')} />}
    </Stack>
  );
};

export default Albums;
