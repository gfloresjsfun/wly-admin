// react
import { useState, useCallback, useMemo } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';
// mui
import { CircularProgress, Stack, OutlinedInput, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useConfirm } from 'material-ui-confirm';
// react query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import MainCard from 'components/MainCard';
import CollectionCreateDialog from 'sections/collections/CollectionCreateDialog';
import CollectionEditDialog from 'sections/collections/CollectionEditDialog';
import CollectionCardList from 'sections/collections/CollectionCardList';
import useDeferredValue from 'hooks/utils/useDeferredValue';
// api
import { getCollections, deleteCollection } from '_api/collections';
// types
import { ICollection } from 'types/collections';

const Collections: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['collections'], queryFn: getCollections });

  // create and edit
  const isCreateOpen = !!useMatch('/collections/create');
  const isEditOpen = !!useMatch('/collections/:id/edit');
  const { id: itemIdInEdit } = useParams();
  const itemInEdit = useMemo(() => data.find(({ id }) => id === itemIdInEdit), [itemIdInEdit, data]);

  // onClose
  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/collections');
  }, [navigate]);

  // delete
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { mutate: deleteMutationFn } = useMutation({
    mutationFn: deleteCollection,
    onSuccess(item) {
      queryClient.setQueryData(['collections'], (collections: ICollection[] = []) => collections.filter(({ id }) => id !== item.id));
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
        <Stack direction="row" justifyContent="space-between">
          <OutlinedInput startAdornment={<SearchIcon />} value={q} onChange={(e) => setQ(e.target.value)} />
          <Button component={Link} to="create" color="primary" variant="contained">
            <AddIcon /> New
          </Button>
        </Stack>
      </MainCard>

      {isLoading ? <CircularProgress /> : <CollectionCardList items={items} onDeleteItem={handleDelete} />}

      {isCreateOpen && <CollectionCreateDialog open={isCreateOpen} onClose={handleClose} />}
      {isEditOpen && itemInEdit && <CollectionEditDialog open={isEditOpen} onClose={handleClose} item={itemInEdit} />}
    </Stack>
  );
};

export default Collections;
