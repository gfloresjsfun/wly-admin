// material-ui
import { Box, CardMedia, Chip, Typography, CardContent, IconButton, Stack } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// types
import { AlbumCardProps } from 'types/albums';

// project import
import MainCard from 'components/MainCard';

// ==============================|| ALBUM CARD ||============================== //

const AlbumCard = ({ title, coverS3Url, shows }: AlbumCardProps) => {
  return (
    <MainCard content={false} boxShadow>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ width: 300, m: 'auto' }}>
          <CardMedia sx={{ height: 300 }} image={coverS3Url} />
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1 }}>
          <Chip icon={<PlayCircleOutlineIcon />} label={`${shows.length} Shows`} color="secondary" />
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, pb: 2.5, pl: 2, pr: 1 }}>
          <Typography color="white" variant="h3">
            {title}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row">
          <IconButton aria-label="edit" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </MainCard>
  );
};

export default AlbumCard;
