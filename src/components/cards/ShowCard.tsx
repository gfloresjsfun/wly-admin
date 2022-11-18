import formatDuration from 'format-duration';
import { Stack, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import MainCard from 'components/MainCard';
import { ShowCardProps } from 'types/shows';

const ShowCard: React.FC<ShowCardProps> = ({ title, duration, coverS3Url }) => (
  <MainCard content={false} boxShadow>
    <Stack direction="row">
      <CardMedia component="img" sx={{ height: 150, width: 150 }} image={coverS3Url} />
      <CardContent>
        <Typography align="left" variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Chip icon={<VideoFileIcon />} label={formatDuration(duration * 1000)} variant="outlined" size="small" />
      </CardContent>
    </Stack>
  </MainCard>
);

export default ShowCard;
