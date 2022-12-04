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
import { createPainPoint } from '_api/painPoints';
// types
import { IPainPoint, PainPointMutationFnVariables, PainPointCreateMutationFnVariables } from 'types/painPoints';

interface PainPointCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const PainPointCreateDialog: React.FC<PainPointCreateDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: createPainPoint,
    onSuccess(data) {
      queryClient.setQueryData(['painPoints'], (painPoints: IPainPoint[] | undefined = []) => [...painPoints, data]);
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleCreate: SubmitHandler<PainPointMutationFnVariables> = ({ name, description, group, suggestions }) => {
    mutate({ name, description, group, suggestions } as PainPointCreateMutationFnVariables);
  };

  return <PainPointFormDialog title="Create pain point" open={open} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />;
};

export default PainPointCreateDialog;
