// react
import { useCallback, useMemo, useState } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';
// mui
import { Button, CircularProgress, OutlinedInput, Stack } from '@mui/material';
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
import SuggestionCardMasonry from 'sections/suggestions/SuggestionCardMasonry';
import SuggestionCreateDialog from 'sections/suggestions/SuggestionCreateDialog';
import SuggestionEditDialog from 'sections/suggestions/SuggestionEditDialog';
import useDeferredValue from 'hooks/utils/useDeferredValue';
// api
import { deleteSuggestion, getSuggestions } from '_api/suggestions';
// types
import { ISuggestion } from 'types/suggestions';

const Suggestions: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['suggestions'], queryFn: getSuggestions });

  // filter
  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  const items = useMemo(
    () => data.filter((item) => item.title.toLocaleLowerCase().includes(deferredQ.toLocaleLowerCase())),
    [data, deferredQ]
  );

  // create and edit
  const isCreateOpen = !!useMatch('/suggestions/create');
  const isEditOpen = !!useMatch('/suggestions/:id/edit');
  const { id: itemIdInEdit } = useParams();
  const itemInEdit = useMemo(() => data.find(({ id }) => id === itemIdInEdit), [itemIdInEdit, data]);

  // onClose
  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/suggestions');
  }, [navigate]);

  // delete
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { mutate: deleteMutationFn } = useMutation({
    mutationFn: deleteSuggestion,
    onSuccess(item) {
      queryClient.setQueryData(['suggestions'], (suggestions: ISuggestion[] = []) => suggestions.filter(({ id }) => id !== item.id));
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

      {isLoading ? <CircularProgress /> : <SuggestionCardMasonry items={items} onDeleteItem={handleDelete} />}
      {isCreateOpen && <SuggestionCreateDialog open={isCreateOpen} onClose={handleClose} />}
      {isEditOpen && itemInEdit && <SuggestionEditDialog open={isEditOpen} onClose={handleClose} item={itemInEdit} />}
    </Stack>
  );
};

export default Suggestions;
