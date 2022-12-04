// react
import { SubmitHandler } from 'react-hook-form';
// react query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import PainPointFormDialog from './PainPointFormDialog';
// api
import { updatePainPoint } from '_api/painPoints';
// types
import { IPainPoint, PainPointMutationFnVariables, PainPointUpdateMutationFnVariables } from 'types/painPoints';

interface PainPointEditDialogProps {
  open: boolean;
  item: IPainPoint;
  onClose: () => void;
}

const PainPointEditDialog: React.FC<PainPointEditDialogProps> = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: updatePainPoint,
    onSuccess(data) {
      queryClient.setQueryData(['painPoints'], (painPoints: IPainPoint[] | undefined = []) =>
        painPoints.map((item) => (item.id === data.id ? data : item))
      );
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleUpdate: SubmitHandler<PainPointMutationFnVariables> = ({ name, description, group, suggestions }) => {
    mutate({ id: item.id, name, description, group, suggestions } as PainPointUpdateMutationFnVariables);
  };

  return (
    <PainPointFormDialog
      title={`Edit pain point "${item.name}"`}
      open={open}
      initialValues={item}
      isMutating={isMutating}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};

export default PainPointEditDialog;
