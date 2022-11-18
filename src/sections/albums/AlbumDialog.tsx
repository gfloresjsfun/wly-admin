import { Add, Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
import { IAlbum, NewAlbum } from 'types/albums';
import { createAlbum } from '_api/albums';
import { getShows } from '_api/shows';

interface AlbumDialogPrpos extends DialogProps {
  onClose: () => void;
}

const AlbumDialog: React.FC<AlbumDialogPrpos> = ({ open, onClose, ...others }) => {
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit
  } = useForm<NewAlbum>();

  const { data: shows } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: createAlbum,
    onSuccess: (data) => {
      queryClient.setQueryData(['albums'], (albums: IAlbum[] | undefined = []) => {
        return [...albums, data];
      });

      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));

      onClose();
    },
    onError: (error) => {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleShowSubmit: SubmitHandler<NewAlbum> = ({ title, shows, cover }) => {
    if (shows.length && cover) {
      mutate({ title, cover, shows });
    } else {
      dispatch(
        openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Please select media file and cover iamge' })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth {...others}>
      <DialogTitle display="flex" justifyContent="space-between">
        DialogTitle
        <Close onClick={onClose} />
      </DialogTitle>

      <DialogContent>
        <form id="album-form" onSubmit={handleSubmit(handleShowSubmit)}></form>
        <Grid container direction="row" spacing={2}>
          <Grid item md={6} sm={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="album-title">Title</InputLabel>
              <OutlinedInput id="album-title" {...register('title', { required: true })} />

              {errors.title && (
                <FormHelperText error id="standard-weight-helper-text-title-login">
                  {errors.title.message}
                </FormHelperText>
              )}
            </Stack>

            <Stack spacing={1} mt={2}>
              <InputLabel htmlFor="shows">Shows</InputLabel>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={shows || []}
                getOptionLabel={(option) => option.title}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} id="shows" placeholder="Favorites" />}
                renderOption={(props, option, { selected }) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img loading="lazy" width="20" src={option.coverS3Url} alt="cover" />
                    {option.title}
                  </Box>
                )}
                onChange={(e, v) =>
                  setValue(
                    'shows',
                    v.map(({ id }) => id)
                  )
                }
              />
            </Stack>
          </Grid>

          <Grid item md={6} sm={12}>
            <Stack spacing={1}>
              <InputLabel>Cover Image</InputLabel>
              <SingleFileUpload onFile={(v) => setValue('cover', v)} />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          <Close />
          Cancel
        </Button>
        <Button type="submit" form="album-form" variant="contained" color="primary" disabled={isLoading}>
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

export default AlbumDialog;
