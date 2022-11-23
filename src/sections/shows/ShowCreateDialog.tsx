import { SubmitHandler } from 'react-hook-form';
import { IShow, ShowMutationFnVariables, ShowCreateMutationFnVariables } from 'types/shows';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShow } from '_api/shows';
import ShowFormDialog from './ShowFormDialog';

interface ShowCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const ShowCreateDialog: React.FC<ShowCreateDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: createShow,
    onSuccess(data) {
      queryClient.setQueryData(['shows'], (shows: IShow[] | undefined = []) => [...shows, data]);
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleCreate: SubmitHandler<ShowMutationFnVariables> = ({ title, media, cover }) => {
    mutate({ title, cover, media } as ShowCreateMutationFnVariables);
  };

  return <ShowFormDialog title="Create show" open={open} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />;
};

export default ShowCreateDialog;
