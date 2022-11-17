import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  useTheme,
  Button,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Edit, Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Preview from 'components/third-party/dropzone/Preview';
import { IShow } from 'types/shows';
import { useEffect, useState } from 'react';
import { getSignedUrl } from '_api/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateShow } from '_api/shows';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'react-redux';

interface EditDialogProps extends DialogProps {
  open: boolean;
  item: IShow;
  onClose: () => void;
}

const PreviewWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  height: '300px',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

const EditDialog: React.FC<EditDialogProps> = ({ open, item, onClose, ...others }) => {
  const theme = useTheme();

  const [title, setTitle] = useState(item.title);
  const [media, setMedia] = useState<File>();
  const [cover, setCover] = useState<File>();

  const [mediaUrl, setMediaUrl] = useState('');
  useEffect(() => {
    getSignedUrl(item.mediaS3Key).then(({ data }) => setMediaUrl(data));
  }, [item]);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation({
    mutationFn: updateShow,
    onSuccess: (data) => {
      queryClient.setQueryData(['shows'], (shows: IShow[] | undefined = []) => {
        return shows.map((item) => {
          if (item.id === data.id) return data;

          return item;
        });
      });

      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'success' }, message: 'Success' }));

      onClose();
    },
    onError: (error) => {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: 'Error' }));
    }
  });

  const handleSubmit = () => {
    mutate({ id: item.id, title, media, cover });
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose} {...others}>
      <DialogTitle>Edit a show</DialogTitle>
      <DialogContent>
        <form id="edit-dialog-form">
          <Stack spacing={1}>
            <InputLabel htmlFor="show-title">Title</InputLabel>
            <OutlinedInput id="show-title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
          </Stack>

          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="show-media">
                  Media File
                  <IconButton component="label">
                    <input hidden accept="video/*,audio/*" type="file" onChange={(e: any) => setMedia(e.target.files[0])} />
                    <Edit />
                  </IconButton>
                </InputLabel>

                <PreviewWrapper>
                  <Box
                    sx={{
                      top: 8,
                      left: 8,
                      borderRadius: 2,
                      position: 'absolute',
                      width: 'calc(100% - 16px)',
                      height: 'calc(100% - 16px)',
                      background: theme.palette.background.paper,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!media && <video src={mediaUrl} width="100%" />}
                    {media && <Preview file={media} />}
                  </Box>
                </PreviewWrapper>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="show-cover">
                  Cover Image
                  <IconButton component="label">
                    <input hidden accept="image/*" type="file" onChange={(e: any) => setCover(e.target.files[0])} />
                    <Edit />
                  </IconButton>
                </InputLabel>

                <PreviewWrapper>
                  <Box
                    sx={{
                      top: 8,
                      left: 8,
                      borderRadius: 2,
                      position: 'absolute',
                      width: 'calc(100% - 16px)',
                      height: 'calc(100% - 16px)',
                      background: theme.palette.background.paper,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!cover && <img src={item.coverS3Url} width="100%" />}
                    {cover && <Preview file={cover} />}
                  </Box>
                </PreviewWrapper>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          <Close />
          Cancel
        </Button>
        <Button type="submit" form="show-dialog-form" variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
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

export default EditDialog;
