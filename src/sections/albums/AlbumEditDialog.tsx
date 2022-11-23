import { IAlbum, AlbumMutationFnVariables, AlbumUpdateMutationFnVariables } from 'types/albums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAlbum } from '_api/albums';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import { SubmitHandler } from 'react-hook-form';
import AlbumFormDialog from './AlbumFormDialog';

interface AlbumEditDialogProps {
  open: boolean;
  item: IAlbum;
  onClose: () => void;
}

const AlbumEditDialog: React.FC<AlbumEditDialogProps> = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: updateAlbum,
    onSuccess(data) {
      queryClient.setQueryData(['albums'], (albums: IAlbum[] | undefined = []) =>
        albums.map((item) => (item.id === data.id ? data : item))
      );
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleUpdate: SubmitHandler<AlbumMutationFnVariables> = ({ title, cover, shows }) => {
    mutate({ id: item.id, title, cover, shows } as AlbumUpdateMutationFnVariables);
  };

  return (
    <AlbumFormDialog
      title={`Edit album "${item.title}"`}
      open={open}
      initialValues={item}
      isMutating={isMutating}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};

export default AlbumEditDialog;
