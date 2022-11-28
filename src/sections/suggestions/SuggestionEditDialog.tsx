// react
import { SubmitHandler } from 'react-hook-form';
// react query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// redux
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// custom
import SuggestionFormDialog from './SuggestionFormDialog';
// api
import { updateSuggestion } from '_api/suggestions';
// types
import { ISuggestion, SuggestionMutationFnVariables, SuggestionUpdateMutationFnVariables } from 'types/suggestions';

interface SuggestionEditDialogProps {
  open: boolean;
  item: ISuggestion;
  onClose: () => void;
}

const SuggestionEditDialog: React.FC<SuggestionEditDialogProps> = ({ open, item, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: updateSuggestion,
    onSuccess(data) {
      queryClient.setQueryData(['suggestions'], (suggestions: ISuggestion[] | undefined = []) =>
        suggestions.map((item) => (item.id === data.id ? data : item))
      );
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleUpdate: SubmitHandler<SuggestionMutationFnVariables> = ({ title, description, playables, tips }) => {
    mutate({ id: item.id, title, description, playables, tips } as SuggestionUpdateMutationFnVariables);
  };

  return (
    <SuggestionFormDialog
      title={`Edit suggestion "${item.title}"`}
      open={open}
      initialValues={item}
      isMutating={isMutating}
      onSubmit={handleUpdate}
      onClose={onClose}
    />
  );
};

export default SuggestionEditDialog;
