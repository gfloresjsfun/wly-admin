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
import ShowCreateDialog from 'sections/shows/ShowCreateDialog';
import ShowEditDialog from 'sections/shows/ShowEditDialog';
import ShowCardList from 'sections/shows/ShowCardList';
import MainCard from 'components/MainCard';
import useDeferredValue from 'hooks/utils/useDeferredValue';
// api
import { getShows, deleteShow } from '_api/shows';
// types
import { IShow } from 'types/shows';

const Shows: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  // create and edit
  const isCreateOpen = !!useMatch('/shows/create');
  const isEditOpen = !!useMatch('/shows/:id/edit');
  const { id: itemIdInEdit } = useParams();
  const itemInEdit = useMemo(() => data.find(({ id }) => id === itemIdInEdit), [itemIdInEdit, data]);

  // onClose
  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/shows');
  }, [navigate]);

  // delete
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { mutate: deleteMutationFn } = useMutation({
    mutationFn: deleteShow,
    onSuccess(item) {
      queryClient.setQueryData(['shows'], (shows: IShow[] = []) => shows.filter(({ id }) => id !== item.id));
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

      {isLoading ? <CircularProgress /> : <ShowCardList items={items} onDeleteItem={handleDelete} />}

      {isCreateOpen && <ShowCreateDialog open={isCreateOpen} onClose={handleClose} />}
      {isEditOpen && itemInEdit && <ShowEditDialog open={isEditOpen} onClose={handleClose} item={itemInEdit} />}
    </Stack>
  );
};

export default Shows;
