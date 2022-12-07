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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// api
import { getSuggestions } from '_api/suggestions';
import { getPainPointGroups } from '_api/painPoints';
// types
import { PainPointMutationFnVariables, IPainPoint } from 'types/painPoints';

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  group: yup.string(),
  suggestions: yup.array().min(1).of(yup.string())
});

interface PainPointFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: IPainPoint;
  isMutating: boolean;
  onSubmit: SubmitHandler<PainPointMutationFnVariables>;
  onClose: () => void;
}

const PainPointFormDialog: React.FC<PainPointFormDialogProps> = ({ title, open, initialValues, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PainPointMutationFnVariables>({
    defaultValues: {
      ...initialValues,
      suggestions: Array.isArray(initialValues?.suggestions) ? initialValues?.suggestions.map(({ id }) => id) : []
    },
    resolver: yupResolver(schema)
  });

  const { data: suggestions, isLoading: isSuggestionsLoading } = useQuery({ queryKey: ['suggestions'], queryFn: getSuggestions });
  const { data: groups, isLoading: isGroupsLoading } = useQuery({ queryKey: ['painPointGroups'], queryFn: getPainPointGroups });

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="pain-point-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pain-point-name">Name</InputLabel>
                  <OutlinedInput id="pain-point-name" fullWidth {...register('name', { required: true })} />
                  {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel htmlFor="pain-point-suggestions">Suggestions</InputLabel>
                  <Autocomplete
                    multiple
                    options={suggestions || []}
                    defaultValue={initialValues?.suggestions}
                    getOptionLabel={(option) => option.title}
                    filterSelectedOptions
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    loading={isSuggestionsLoading}
                    renderInput={(params) => <TextField {...params} placeholder="Suggestions" />}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.title}
                      </Box>
                    )}
                    onChange={(e, v) => {
                      setValue(
                        'suggestions',
                        v.map(({ id }) => id)
                      );
                    }}
                  />
                  {errors.suggestions && <FormHelperText error>{errors.suggestions.message}</FormHelperText>}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pain-point-description">Description</InputLabel>
                  <OutlinedInput id="pain-point-description" fullWidth {...register('description', { required: true })} />
                  {errors.description && <FormHelperText error>{errors.description.message}</FormHelperText>}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel htmlFor="pain-point-group">Group</InputLabel>
                  <Autocomplete
                    freeSolo
                    options={groups || []}
                    defaultValue={initialValues?.group}
                    filterSelectedOptions
                    loading={isGroupsLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Group"
                        onChange={(e) => {
                          setValue('group', e.target.value);
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option}
                      </Box>
                    )}
                    onChange={(e, v) => {
                      console.log(v);
                      if (v) setValue('group', v);
                    }}
                  />
                  {errors.group && <FormHelperText error>{errors.group.message}</FormHelperText>}
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
        <Button type="submit" form="pain-point-dialog-form" variant="contained" color="primary" disabled={isMutating}>
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

export default PainPointFormDialog;
