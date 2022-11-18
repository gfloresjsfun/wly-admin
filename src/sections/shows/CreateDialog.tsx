import { Add, Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { IShow, NewShow } from 'types/shows';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShow } from '_api/shows';

interface CreateDialogProps extends DialogProps {
  onSave?: (data: IShow) => void;
  onClose: () => void;
}

const CreateDialog: React.FC<CreateDialogProps> = ({ open, onClose, onSave, ...others }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewShow>();
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: createShow,
    onSuccess: (data) => {
      if (onSave) onSave(data);

      queryClient.setQueryData(['shows'], (shows: IShow[] | undefined = []) => {
        return [...shows, data];
      });

      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));

      onClose();
    },
    onError: (error) => {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleShowSubmit: SubmitHandler<NewShow> = ({ title, media, cover }) => {
    if (media && cover) {
      mutate({ title, cover, media });
    } else {
      dispatch(
        openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Please select media file and cover iamge' })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth {...others}>
      <DialogTitle>Add a new show</DialogTitle>

      <DialogContent>
        <form id="show-dialog-form" onSubmit={handleSubmit(handleShowSubmit)}>
          <Stack spacing={1}>
            <InputLabel htmlFor="show-title">Title</InputLabel>
            <OutlinedInput id="show-title" fullWidth {...register('title', { required: true })} />

            {errors.title && (
              <FormHelperText error id="standard-weight-helper-text-title-login">
                {errors.title.message}
              </FormHelperText>
            )}
          </Stack>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="show-title">Media File</InputLabel>
                <SingleFileUpload accept={{ 'video/*': [], 'audio/*': [] }} onFile={(v) => setValue('media', v)} />
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="show-title">Cover Image</InputLabel>
                <SingleFileUpload onFile={(v) => setValue('cover', v)} />
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          <Close />
          Cancel
        </Button>
        <Button type="submit" form="show-dialog-form" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size="1.5rem" color="primary" />
          ) : (
            <>
              <Add />
              Add
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;
