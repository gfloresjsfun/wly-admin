import { styled, useTheme } from '@mui/material/styles';
import { Box, SxProps, Theme } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import PlaceholderContent from './PlaceholderContent';
import RejectionFiles from './RejectionFiles';
import { useState } from 'react';
import Preview from './Preview';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

interface UploadProps extends DropzoneOptions {
  error?: boolean;
  onFile: (v: File) => void;
  sx?: SxProps<Theme>;
  type?: string;
}

const SingleFileUpload: React.FC<UploadProps> = ({ error, onFile, sx, accept }) => {
  const theme = useTheme();

  const [file, setFile] = useState<File>();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: accept || { 'image/*': [] },
    multiple: false,
    onDrop: (files: File[]) => {
      onFile(files[0]);
      setFile(files[0]);
    }
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && { color: 'error.main', borderColor: 'error.light', bgcolor: 'error.lighter' })
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent />

        {file && (
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
              justifyContent: 'center'
            }}
          >
            <Preview file={file} />
          </Box>
        )}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
    </Box>
  );
};

export default SingleFileUpload;
