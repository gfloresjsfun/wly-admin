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
import { createCollection } from '_api/collections';
// types
import { ICollection, CollectionMutationFnVariables, CollectionCreateMutationFnVariables } from 'types/collections';

interface CollectionCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const CollectionCreateDialog: React.FC<CollectionCreateDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: createCollection,
    onSuccess(data) {
      queryClient.setQueryData(['collections'], (collections: ICollection[] | undefined = []) => [...collections, data]);
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleCreate: SubmitHandler<CollectionMutationFnVariables> = ({ title, playables }) => {
    mutate({ title, playables } as CollectionCreateMutationFnVariables);
  };

  return <CollectionFormDialog title="Create collection" open={open} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />;
};

export default CollectionCreateDialog;
