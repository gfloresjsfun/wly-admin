// react
import { SubmitHandler, useForm } from 'react-hook-form';
// mui
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
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
// react query
import { useQuery } from '@tanstack/react-query';
// other
import { AnyObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// custom
import CoverUpload from 'components/third-party/dropzone/CoverUpload';
// api
import { getShows } from '_api/shows';
// types
import { AlbumMutationFnVariables, IAlbum } from 'types/albums';

interface AlbumFormDialogProps {
  title: string;
  open: boolean;
  schema: AnyObjectSchema;
  initialValues?: IAlbum;
  isMutating: boolean;
  onSubmit: SubmitHandler<AlbumMutationFnVariables>;
  onClose: () => void;
}

const AlbumFormDialog: React.FC<AlbumFormDialogProps> = ({ title, open, schema, initialValues, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AlbumMutationFnVariables>({
    defaultValues: { ...initialValues, shows: Array.isArray(initialValues?.shows) ? initialValues?.shows.map(({ id }) => id) : [] },
    resolver: yupResolver(schema)
  });

  const { data: shows, isLoading: isShowsLoading } = useQuery({ queryKey: ['shows'], queryFn: getShows });

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="album-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="album-title">Title</InputLabel>
                  <OutlinedInput id="album-title" fullWidth {...register('title', { required: true })} />
                  {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel htmlFor="album-shows">Shows</InputLabel>
                  <Autocomplete
                    multiple
                    options={shows || []}
                    defaultValue={initialValues?.shows}
                    getOptionLabel={(option) => option.title}
                    filterSelectedOptions
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    loading={isShowsLoading}
                    renderInput={(params) => <TextField {...params} id="album-shows" placeholder="Shows" />}
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
                  {errors.shows && <FormHelperText error>{errors.shows.message}</FormHelperText>}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel>Cover Image</InputLabel>
                <CoverUpload onFile={(v) => setValue('cover', v)} defaultUrl={initialValues?.coverS3Url} />

                {errors.cover && <FormHelperText error>{errors.cover.message}</FormHelperText>}
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          <CloseIcon />
          Cancel
        </Button>
        <Button type="submit" form="album-dialog-form" variant="contained" color="primary" disabled={isMutating}>
          {isMutating ? (
            <CircularProgress size="1.5rem" color="primary" />
          ) : (
            <>
              <EditIcon />
              Update
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlbumFormDialog;
