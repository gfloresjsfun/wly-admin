import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Button,
  DialogActions,
  CircularProgress,
  FormHelperText,
  Autocomplete,
  TextField,
  Box
} from '@mui/material';
import { Edit, Close } from '@mui/icons-material';
import { AlbumMutationFnVariables, IAlbum } from 'types/albums';
import { SubmitHandler, useForm } from 'react-hook-form';
import CoverUpload from 'components/third-party/dropzone/CoverUpload';
import { getShows } from '_api/shows';
import { useQuery } from '@tanstack/react-query';

interface AlbumFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: IAlbum;
  isMutating: boolean;
  onSubmit: SubmitHandler<AlbumMutationFnVariables>;
  onClose: () => void;
}

const AlbumFormDialog: React.FC<AlbumFormDialogProps> = ({ title, open, initialValues, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AlbumMutationFnVariables>({
    defaultValues: { ...initialValues, shows: Array.isArray(initialValues?.shows) ? initialValues?.shows.map(({ id }) => id) : [] }
  });

  const { data: shows, isLoading: isShowsLoading } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="album-edit-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="album-title">Title</InputLabel>
                  <OutlinedInput id="album-title" fullWidth {...register('title', { required: true })} />

                  {errors.title && (
                    <FormHelperText error id="standard-weight-helper-text-title-login">
                      {errors.title.message}
                    </FormHelperText>
                  )}
                </Stack>
                <Stack spacing={1}>
                  <InputLabel htmlFor="shows">Shows</InputLabel>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={shows || []}
                    defaultValue={initialValues?.shows}
                    getOptionLabel={(option) => option.title}
                    filterSelectedOptions
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    loading={isShowsLoading}
                    renderInput={(params) => <TextField {...params} id="shows" placeholder="Shows" />}
                    renderOption={(props, option) => (
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
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="album-title">Cover Image</InputLabel>
                <CoverUpload onFile={(v) => setValue('cover', v)} defaultUrl={initialValues?.coverS3Url} />

                {errors.cover && (
                  <FormHelperText error id="standard-weight-helper-text-title-login">
                    {errors.cover.message}
                  </FormHelperText>
                )}
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
        <Button type="submit" form="album-edit-dialog-form" variant="contained" color="primary" disabled={isMutating}>
          {isMutating ? (
            <CircularProgress size="1.5rem" color="primary" />
          ) : (
            <>
              <Edit />
              Update
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlbumFormDialog;
