// react
import { SubmitHandler } from 'react-hook-form';
// react query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import CollectionFormDialog from './CollectionFormDialog';
// api
import { updateCollection } from '_api/collections';
// types
import { ICollection, CollectionMutationFnVariables, CollectionUpdateMutationFnVariables } from 'types/collections';

interface CollectionEditDialogProps {
  open: boolean;
  item: ICollection;
  onClose: () => void;
}

const CollectionEditDialog: React.FC<CollectionEditDialogProps> = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: updateCollection,
    onSuccess(data) {
      queryClient.setQueryData(['collections'], (collections: ICollection[] | undefined = []) =>
        collections.map((item) => (item.id === data.id ? data : item))
      );
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleUpdate: SubmitHandler<CollectionMutationFnVariables> = ({ title, playables }) => {
    mutate({ id: item.id, title, playables } as CollectionUpdateMutationFnVariables);
  };

  return (
    <CollectionFormDialog
      title={`Edit collection "${item.title}"`}
      open={open}
      initialValues={item}
      isMutating={isMutating}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};

export default CollectionEditDialog;
