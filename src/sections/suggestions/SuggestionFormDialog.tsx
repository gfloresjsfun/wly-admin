// react
import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
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
  Box,
  IconButton,
  Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useConfirm } from 'material-ui-confirm';
// react query
import { useQueries } from '@tanstack/react-query';
// other
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// custom
import TipForm from './TipForm';
import TipItem from './TipItem';
// api
import { getShows } from '_api/shows';
import { getAlbums } from '_api/albums';
// types
import { ISuggestion } from 'types/suggestions';
import { ITip, PlayableType, SuggestionMutationFnVariables } from 'types/suggestions';
import { IShow } from 'types/shows';
import { IAlbum } from 'types/albums';

interface SuggestionFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: ISuggestion;
  isMutating: boolean;
  onSubmit: SubmitHandler<SuggestionMutationFnVariables>;
  onClose: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  playables: yup
    .array()
    .min(1)
    .of(
      yup.object().shape({
        playable: yup.string().required(),
        playableType: yup.string().oneOf(['Show', 'Album']).required()
      })
    )
    .required(),
  tips: yup.array().of(
    yup.object().shape({
      summary: yup.string().required(),
      details: yup.string().required()
    })
  )
});

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
    },
    resolver: yupResolver(schema)
  });

  const { append: appendTip, fields: tips, remove: removeTip, update: updateTip } = useFieldArray({ name: 'tips', control });

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

  // tips
  const [tipFormOpen, setTipFormOpen] = useState(false);
  const handleTipFormCancel = () => {
    setTipFormOpen(false);
  };

  const handleTipCreate = useCallback(
    (data: ITip) => {
      appendTip(data);
      setTipFormOpen(false);
    },
    [appendTip]
  );

  const handleTipUpdate = useCallback(
    (idx: number, tip: ITip) => {
      updateTip(idx, tip);
    },
    [updateTip]
  );

  const confirm = useConfirm();
  const handleTipDelete = useCallback(
    (idx: number) => {
      confirm({ description: 'Are you sure to delete this item?' }).then(() => removeTip(idx));
    },
    [confirm, removeTip]
  );

  const tipList = useMemo(
    () =>
      tips.map((item, idx) => (
        <TipItem key={item.id} item={item} onDelete={() => handleTipDelete(idx)} onSave={(tip) => handleTipUpdate(idx, tip)} />
      )),
    [tips, handleTipDelete, handleTipUpdate]
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
                  {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                </Stack>

                <Stack spacing={0}>
                  <InputLabel htmlFor="suggestion-description">Description</InputLabel>
                  <OutlinedInput id="suggestion-description" multiline {...register('description', { required: true })} />
                  {errors.description && <FormHelperText error>{errors.description.message}</FormHelperText>}
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

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel>Tips</InputLabel>
                <Stack>{tipList}</Stack>

                <Collapse in={!tipFormOpen}>
                  <IconButton color="primary" size="large" onClick={() => setTipFormOpen(true)}>
                    <AddIcon />
                  </IconButton>
                </Collapse>

                <Collapse in={tipFormOpen}>
                  <TipForm initialValues={{ summary: '', details: '' } as ITip} onSubmit={handleTipCreate} onCancel={handleTipFormCancel} />
                </Collapse>
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
        <Button type="submit" form="suggestion-edit-dialog-form" variant="contained" color="primary" disabled={isMutating}>
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

export default SuggestionFormDialog;
