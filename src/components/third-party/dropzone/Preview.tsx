import { useMemo } from 'react';
import { Box } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';

const Preview: React.FC<{ file: File }> = ({ file }) => {
  const preview = useMemo(() => file && URL.createObjectURL(file), [file]);

  if (!file) return <></>;

  if (file.type.includes('video')) return <video width="100%" src={preview}></video>;
  if (file.type.includes('image')) return <img width="100%" alt="Preview" src={preview}></img>;

  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <UploadFileOutlined sx={{ fontSize: '5rem' }} />
      {file.name}
    </Box>
  );
};

export default Preview;
