// react
import { useState, useCallback, useMemo } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';
// mui
import { CircularProgress, Stack, OutlinedInput, Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
// react query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import MainCard from 'components/MainCard';
import PainPointCreateDialog from 'sections/painPoints/PainPointCreateDialog';
import PainPointEditDialog from 'sections/painPoints/PainPointEditDialog';
import PainPointTable from 'sections/painPoints/PainPointTable';
import useDeferredValue from 'hooks/utils/useDeferredValue';
// api
import { getPainPoints, deletePainPoint } from '_api/painPoints';
// types
import { IPainPoint } from 'types/painPoints';

const PainPoints: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['painPoints'], queryFn: getPainPoints });

  // create and edit
  const isCreateOpen = !!useMatch('/pain-points/create');
  const isEditOpen = !!useMatch('/pain-points/:id/edit');
  const { id: itemIdInEdit } = useParams();
  const itemInEdit = useMemo(() => data.find(({ id }) => id === itemIdInEdit), [itemIdInEdit, data]);

  // onClose
  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/pain-points');
  }, [navigate]);

  // delete
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { mutate: deleteMutationFn } = useMutation({
    mutationFn: deletePainPoint,
    onSuccess(item) {
      queryClient.setQueryData(['painPoints'], (painPoints: IPainPoint[] = []) => painPoints.filter(({ id }) => id !== item.id));
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
    () => data.filter((item) => item.name.toLocaleLowerCase().includes(deferredQ.toLocaleLowerCase())),
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

      {isLoading ? <CircularProgress /> : <PainPointTable items={items} onDeleteItem={handleDelete} />}
      {isCreateOpen && <PainPointCreateDialog open={isCreateOpen} onClose={handleClose} />}
      {isEditOpen && itemInEdit && <PainPointEditDialog open={isEditOpen} onClose={handleClose} item={itemInEdit} />}
    </Stack>
  );
};

export default PainPoints;
