import { useCallback, useMemo } from 'react';
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
import { ITip, PlayableType, SuggestionMutationFnVariables } from 'types/suggestions';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useQueries } from '@tanstack/react-query';
import { ISuggestion } from 'types/suggestions';
import { getShows } from '_api/shows';
import { getAlbums } from '_api/albums';
import { IShow } from 'types/shows';
import { IAlbum } from 'types/albums';
import TipFormDialog from './TipFormDialog';
import TipItem from './TipItem';

interface SuggestionFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: ISuggestion;
  isMutating: boolean;
  onSubmit: SubmitHandler<SuggestionMutationFnVariables>;
  onClose: () => void;
}

const SuggestionFormDialog: React.FC<SuggestionFormDialogProps> = ({ title, open, initialValues, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SuggestionMutationFnVariables>({
    defaultValues: {
      ...initialValues,
      playables: initialValues?.playables.map((item) => ({ playable: item.playable.id, playableType: item.playableType }))
    }
  });

  const { append: appendTip, fields: tips, remove: removeTip } = useFieldArray({ name: 'tips', control });

  const [{ isLoading: isShowsLoading, data: shows }, { isLoading: isAlbumsLoading, data: albums }] = useQueries({
    queries: [
      {
        queryKey: ['shows'],
        queryFn: getShows,
        select: (data: IShow[]) => data.map((item) => ({ ...item, playableType: PlayableType.Show }))
      },
      {
        queryKey: ['albums'],
        queryFn: getAlbums,
        select: (data: IAlbum[]) => data.map((item) => ({ ...item, playableType: PlayableType.Album }))
      }
    ]
  });

  // tips
  const handleAddTip = (data: ITip) => {
    appendTip(data);
  };

  const handleTipDelete = useCallback(
    (idx: number) => {
      removeTip(idx);
    },
    [removeTip]
  );

  const tipList = useMemo(
    () => tips.map((item, idx) => <TipItem key={item.id} item={item} onDelete={() => handleTipDelete(idx)} />),
    [tips, handleTipDelete]
  );

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="suggestion-edit-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="suggestion-title">Title</InputLabel>
                  <OutlinedInput id="suggestion-title" fullWidth {...register('title', { required: true })} />

                  {errors.title && (
                    <FormHelperText error id="standard-weight-helper-text-title-login">
                      {errors.title.message}
                    </FormHelperText>
                  )}
                </Stack>

                <Stack spacing={0}>
                  <InputLabel htmlFor="suggestion-description">Description</InputLabel>
                  <OutlinedInput id="suggestion-description" multiline {...register('description', { required: true })} />

                  {errors.description && (
                    <FormHelperText error id="standard-weight-helper-text-description-login">
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel htmlFor="shows">Shows and Albums</InputLabel>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={[...(shows || []), ...(albums || [])]}
                    getOptionLabel={(option) => option.title}
                    groupBy={(option) => option.playableType}
                    filterSelectedOptions
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    loading={isShowsLoading || isAlbumsLoading}
                    renderInput={(params) => <TextField {...params} id="shows" placeholder="Favorites" />}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img loading="lazy" width="20" src={option.coverS3Url} alt="cover" />
                        {option.title}
                      </Box>
                    )}
                    onChange={(e, v) =>
                      setValue(
                        'playables',
                        v.map((item) => ({ playable: item.id, playableType: item.playableType as PlayableType }))
                      )
                    }
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="shows">Tips</InputLabel>
                <Stack>{tipList}</Stack>
                <TipFormDialog onSubmit={handleAddTip} />
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
        <Button type="submit" form="suggestion-edit-dialog-form" variant="contained" color="primary" disabled={isMutating}>
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

export default SuggestionFormDialog;
