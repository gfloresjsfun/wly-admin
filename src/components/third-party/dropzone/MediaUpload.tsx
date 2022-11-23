import { useState } from 'react';
import { CardMedia, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactPlayer from 'react-player';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import RejectionFiles from './RejectionFiles';
import UploadCover from 'assets/images/upload/upload.svg';

const DropzoneWrapper = styled(Stack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  '& video': { display: 'block' }
}));

const WLYMediaPlayer = styled(ReactPlayer)({
  '& video': { display: 'block' }
});

interface UploadProps extends DropzoneOptions {
  onFile: (v: File) => void;
  defaultUrl: string | undefined;
}

const MediaUpload: React.FC<UploadProps> = ({ onFile, defaultUrl }) => {
  const [url, setUrl] = useState<string>();
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'video/*': [], 'audio/*': [] },
    multiple: false,
    onDrop: (files: File[]) => {
      onFile(files[0]);
      setUrl(URL.createObjectURL(files[0]));
    }
  });
  const mediaUrl = defaultUrl || url;

  return (
    <Stack>
      <Stack spacing={0}>
        {mediaUrl && <WLYMediaPlayer url={mediaUrl} width="100%" height="100%" controls />}
        <DropzoneWrapper
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...(isDragReject && { color: 'error.main', borderColor: 'error.light', bgcolor: 'error.lighter' })
          }}
          spacing={2}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
          paddingY={2}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 100 }} />
          <Typography variant="h5">Drag & Drop or Select file</Typography>
        </DropzoneWrapper>
      </Stack>

      <input {...getInputProps()} />

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
    </Stack>
  );
};

export default MediaUpload;
