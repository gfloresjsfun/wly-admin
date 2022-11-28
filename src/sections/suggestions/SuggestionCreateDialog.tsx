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
import { createSuggestion } from '_api/suggestions';
// types
import { ISuggestion, SuggestionMutationFnVariables, SuggestionCreateMutationFnVariables } from 'types/suggestions';

interface SuggestionCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const SuggestionCreateDialog: React.FC<SuggestionCreateDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isMutating, mutate } = useMutation({
    mutationFn: createSuggestion,
    onSuccess(data) {
      queryClient.setQueryData(['suggestions'], (suggestions: ISuggestion[] | undefined = []) => [...suggestions, data]);
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));
      onClose();
    },
    onError(error) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleCreate: SubmitHandler<SuggestionMutationFnVariables> = ({ title, description, playables, tips }) => {
    mutate({ title, description, playables, tips } as SuggestionCreateMutationFnVariables);
  };

  return <SuggestionFormDialog title="Create suggestion" open={open} isMutating={isMutating} onSubmit={handleCreate} onClose={onClose} />;
};

export default SuggestionCreateDialog;
