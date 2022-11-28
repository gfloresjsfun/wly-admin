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
import { useQueries } from '@tanstack/react-query';
// other
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// api
import { getShows } from '_api/shows';
import { getAlbums } from '_api/albums';
// types
import { ICollection } from 'types/collections';
import { PlayableType, CollectionMutationFnVariables } from 'types/collections';
import { IShow } from 'types/shows';
import { IAlbum } from 'types/albums';

interface CollectionFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: ICollection;
  isMutating: boolean;
  onSubmit: SubmitHandler<CollectionMutationFnVariables>;
  onClose: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  playables: yup
    .array()
    .min(1)
    .of(
      yup.object().shape({
        playable: yup.string().required(),
        playableType: yup.string().oneOf(['Show', 'Album']).required()
      })
    )
    .required()
});

const CollectionFormDialog: React.FC<CollectionFormDialogProps> = ({ title, open, initialValues, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CollectionMutationFnVariables>({
    defaultValues: {
      ...initialValues,
      playables: initialValues?.playables.map((item) => ({ playable: item.playable.id, playableType: item.playableType }))
    },
    resolver: yupResolver(schema)
  });

  const [{ isLoading: isShowsLoading, data: shows }, { isLoading: isAlbumsLoading, data: albums }] = useQueries({
    queries: [
      {
        queryKey: ['shows'],
        queryFn: getShows,
        select: (data: IShow[]) => data.map((item) => ({ playable: item, playableType: PlayableType.Show }))
      },
      {
        queryKey: ['albums'],
        queryFn: getAlbums,
        select: (data: IAlbum[]) => data.map((item) => ({ playable: item, playableType: PlayableType.Album }))
      }
    ]
  });

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="collection-edit-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="collection-title">Title</InputLabel>
                  <OutlinedInput id="collection-title" fullWidth {...register('title', { required: true })} />
                  {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel htmlFor="shows">Shows and Albums</InputLabel>
                  <Autocomplete
                    multiple
                    options={[...(shows || []), ...(albums || [])]}
                    defaultValue={initialValues?.playables}
                    getOptionLabel={(option) => option.playable.title}
                    groupBy={(option) => option.playableType}
                    filterSelectedOptions
                    isOptionEqualToValue={(opt, val) => opt.playable.id === val.playable.id}
                    loading={isShowsLoading || isAlbumsLoading}
                    renderInput={(params) => <TextField {...params} id="shows" placeholder="Favorites" />}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img loading="lazy" width="20" src={option.playable.coverS3Url} alt="cover" />
                        {option.playable.title}
                      </Box>
                    )}
                    onChange={(e, v) =>
                      setValue(
                        'playables',
                        v.map((item) => ({ playable: item.playable.id, playableType: item.playableType }))
                      )
                    }
                  />
                  {errors.playables && <FormHelperText error>{errors.playables.message}</FormHelperText>}
                </Stack>
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
        <Button type="submit" form="collection-edit-dialog-form" variant="contained" color="primary" disabled={isMutating}>
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

export default CollectionFormDialog;
