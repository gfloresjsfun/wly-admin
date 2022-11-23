import { SubmitHandler } from 'react-hook-form';
import { IAlbum, AlbumMutationFnVariables, AlbumCreateMutationFnVariables } from 'types/albums';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAlbum } from '_api/albums';
import AlbumFormDialog from './AlbumFormDialog';

interface AlbumCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const AlbumCreateDialog: React.FC<AlbumCreateDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: createAlbum,
    onSuccess(data) {
      queryClient.setQueryData(['albums'], (albums: IAlbum[] | undefined = []) => [...albums, data]);
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleCreate: SubmitHandler<AlbumMutationFnVariables> = ({ title, cover, shows }) => {
    mutate({ title, cover, shows } as AlbumCreateMutationFnVariables);
  };

  return <AlbumFormDialog title="Create album" open={open} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />;
};

export default AlbumCreateDialog;
