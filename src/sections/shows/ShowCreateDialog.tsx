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
import ShowFormDialog from './ShowFormDialog';
// api
import { createShow } from '_api/shows';
// types
import { IShow, ShowMutationFnVariables, ShowCreateMutationFnVariables } from 'types/shows';

interface ShowCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  cover: yup
    .mixed()
    .required()
    .test('fileSize', 'cover image is too large', (value) => value && value.size <= 1 * 1024 * 1024)
    .test('fileFormat', 'unsupported format', (value) => value && value.type.startsWith('image/')),
  media: yup
    .mixed()
    .required()
    .test('fileSize', 'media file is too large', (value) => value && value.size <= 10 * 1024 * 1024)
    .test('fileFormat', 'unsupported format', (value) => value && (value.type.startsWith('audio/') || value.type.startsWith('video/')))
});

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

  return (
    <ShowFormDialog title="Create show" open={open} schema={schema} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />
  );
};

export default ShowCreateDialog;
