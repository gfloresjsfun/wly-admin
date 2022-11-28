import { IShow, ShowMutationFnVariables, ShowUpdateMutationFnVariables } from 'types/shows';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShow } from '_api/shows';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';
import { SubmitHandler } from 'react-hook-form';
import ShowFormDialog from './ShowFormDialog';

interface ShowEditDialogProps {
  open: boolean;
  item: IShow;
  onClose: () => void;
}

const schema = yup
  .object()
  .shape(
    {
      title: yup.string().required(),
      cover: yup.mixed().when('cover', {
        is: (exists: any) => !!exists,
        then: (schema) =>
          schema
            .test('fileSize', 'cover image is too large', (value) => value && value.size <= 1 * 1024 * 1024)
            .test('fileFormat', 'unsupported format', (value) => value && value.type.startsWith('image/'))
      }),
      media: yup.mixed().when('media', {
        is: (exists: any) => !!exists,
        then: (schema) =>
          schema
            .test('fileSize', 'media file is too large', (value) => value && value.size <= 10 * 1024 * 1024)
            .test(
              'fileFormat',
              'unsupported format',
              (value) => value && (value.type.startsWith('audio/') || value.type.startsWith('video/'))
            )
      })
    },
    [
      ['cover', 'cover'],
      ['media', 'media']
    ]
  )
  .required();

const ShowEditDialog: React.FC<ShowEditDialogProps> = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: updateShow,
    onSuccess(data) {
      queryClient.setQueryData(['shows'], (shows: IShow[] | undefined = []) => shows.map((item) => (item.id === data.id ? data : item)));
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleUpdate: SubmitHandler<ShowMutationFnVariables> = ({ title, media, cover }) => {
    mutate({ id: item.id, title, media, cover } as ShowUpdateMutationFnVariables);
  };

  return (
    <ShowFormDialog
      title={`Edit show "${item.title}"`}
      open={open}
      initialValues={item}
      schema={schema}
      isMutating={isMutating}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};

export default ShowEditDialog;
