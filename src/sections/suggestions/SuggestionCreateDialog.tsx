import { SubmitHandler } from 'react-hook-form';
import { ISuggestion, SuggestionMutationFnVariables, SuggestionCreateMutationFnVariables } from 'types/suggestions';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSuggestion } from '_api/suggestions';
import SuggestionFormDialog from './SuggestionFormDialog';

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
