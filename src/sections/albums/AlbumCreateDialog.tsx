// react
import { SubmitHandler } from 'react-hook-form';
// react query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// other
import * as yup from 'yup';
// custom
import AlbumFormDialog from './AlbumFormDialog';
// api
import { createAlbum } from '_api/albums';
// types
import { IAlbum, AlbumMutationFnVariables, AlbumCreateMutationFnVariables } from 'types/albums';

interface AlbumCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  shows: yup.array().min(1).of(yup.string()),
  cover: yup
    .mixed()
    .required()
    .test('fileSize', 'cover image is too large', (value) => value && value.size <= 1 * 1024 * 1024)
    .test('fileFormat', 'unsupported format', (value) => value && value.type.startsWith('image/'))
});

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

  return (
    <AlbumFormDialog title="Create album" open={open} schema={schema} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />
  );
};

export default AlbumCreateDialog;
