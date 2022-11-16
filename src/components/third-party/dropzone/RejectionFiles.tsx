// material-ui
import { alpha } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';

// third-party
import { FileRejection } from 'react-dropzone';

// ==============================|| DROPZONE - REJECTION FILES ||============================== //

type Props = {
  fileRejections: FileRejection[];
};

export default function RejectionFiles({ fileRejections }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { name, size } = file;

        return (
          <Box key={name} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {name} - {size ? size : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="li" sx={{ typography: 'caption' }}>
                {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}
