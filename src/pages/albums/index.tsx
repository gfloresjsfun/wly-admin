import { useState, useCallback, useMemo } from 'react';
import { CircularProgress, Stack, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useConfirm } from 'material-ui-confirm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AlbumCreateDialog from 'sections/albums/AlbumCreateDialog';
import AlbumEditDialog from 'sections/albums/AlbumEditDialog';
import { getAlbums, deleteAlbum } from '_api/albums';
import { useMatch, useNavigate, useParams } from 'react-router';
import AlbumCardList from 'sections/albums/AlbumCardList';
import MainCard from 'components/MainCard';
import useDeferredValue from 'hooks/utils/useDeferredValue';
import { IAlbum } from 'types/albums';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

const Albums: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['albums'], queryFn: getAlbums });

  // create and edit
  const isCreateOpen = !!useMatch('/albums/create');
  const isEditOpen = !!useMatch('/albums/:id/edit');
  const { id: itemIdInEdit } = useParams();
  const itemInEdit = useMemo(() => data.find(({ id }) => id === itemIdInEdit), [itemIdInEdit, data]);

  // onClose
  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/albums');
  }, [navigate]);

  // delete
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { mutate: deleteMutationFn } = useMutation({
    mutationFn: deleteAlbum,
    onSuccess(item) {
      queryClient.setQueryData(['albums'], (albums: IAlbum[] = []) => albums.filter(({ id }) => id !== item.id));
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleDelete = useCallback(
    (id) => confirm({ description: 'Are you sure to delete this item?' }).then(() => deleteMutationFn(id)),
    [confirm, deleteMutationFn]
  );

  // filter
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

      {isCreateOpen && <AlbumCreateDialog open={isCreateOpen} onClose={handleClose} />}
      {isEditOpen && itemInEdit && <AlbumEditDialog open={isEditOpen} onClose={handleClose} item={itemInEdit} />}
    </Stack>
  );
};

export default Albums;
