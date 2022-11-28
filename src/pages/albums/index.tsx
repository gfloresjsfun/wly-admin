// react
import { useState, useCallback, useMemo } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
// mui
import { CircularProgress, Stack, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useConfirm } from 'material-ui-confirm';
// react query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import MainCard from 'components/MainCard';
import AlbumCreateDialog from 'sections/albums/AlbumCreateDialog';
import AlbumEditDialog from 'sections/albums/AlbumEditDialog';
import AlbumCardList from 'sections/albums/AlbumCardList';
import useDeferredValue from 'hooks/utils/useDeferredValue';
// api
import { getAlbums, deleteAlbum } from '_api/albums';
// types
import { IAlbum } from 'types/albums';

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
