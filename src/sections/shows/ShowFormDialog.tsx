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
  FormHelperText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { yupResolver } from '@hookform/resolvers/yup';
import { IShow, ShowMutationFnVariables } from 'types/shows';
import { SubmitHandler, useForm } from 'react-hook-form';
import CoverUpload from 'components/third-party/dropzone/CoverUpload';
import MediaUpload from 'components/third-party/dropzone/MediaUpload';
import { getSignedUrl } from '_api/common';
import { useQuery } from '@tanstack/react-query';
import { AnyObjectSchema } from 'yup';

interface ShowFormDialogProps {
  title: string;
  open: boolean;
  initialValues?: IShow;
  schema: AnyObjectSchema;
  isMutating: boolean;
  onSubmit: SubmitHandler<ShowMutationFnVariables>;
  onClose: () => void;
}

const ShowFormDialog: React.FC<ShowFormDialogProps> = ({ title, open, initialValues, schema, isMutating, onSubmit, onClose }) => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ShowMutationFnVariables>({ defaultValues: initialValues, resolver: yupResolver(schema) });

  const { data: mediaUrl } = useQuery({
    queryKey: ['mediaUrls', initialValues?.mediaS3Key],
    queryFn: () => getSignedUrl(initialValues?.mediaS3Key as string),
    enabled: !!initialValues?.mediaS3Key
  });

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="show-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={2}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="show-title">Title</InputLabel>
                  <OutlinedInput id="show-title" fullWidth {...register('title', { required: true })} />
                  {errors.title && <FormHelperText error>{errors.title.message}</FormHelperText>}
                </Stack>

                <Stack spacing={1}>
                  <InputLabel>Cover Image</InputLabel>
                  <CoverUpload onFile={(v) => setValue('cover', v)} defaultUrl={initialValues?.coverS3Url} />
                  {errors.cover && <FormHelperText error>{errors.cover.message}</FormHelperText>}
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel>Media File</InputLabel>
                <MediaUpload onFile={(v) => setValue('media', v)} defaultUrl={mediaUrl} />
                {errors.media && <FormHelperText error>{errors.media.message}</FormHelperText>}
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
        <Button type="submit" form="show-dialog-form" variant="contained" color="primary" disabled={isMutating}>
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

export default ShowFormDialog;
