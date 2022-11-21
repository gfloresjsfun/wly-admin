import { Link } from 'react-router-dom';
import formatDuration from 'format-duration';
import { Stack, CardContent, CardMedia, CardActions, Typography, Chip, IconButton } from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'components/MainCard';
import { ShowCardProps } from 'types/shows';

const ShowCard: React.FC<ShowCardProps> = ({ item: { id, title, duration, coverS3Url }, onDelete }) => (
  <MainCard content={false} boxShadow>
    <Stack direction="row">
      <CardMedia component="img" sx={{ height: 150, width: 150 }} image={coverS3Url} />
      <Stack direction="column" flexGrow={1}>
        <CardContent>
          <Typography align="left" variant="h5" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Chip icon={<VideoFileIcon />} label={formatDuration(duration * 1000)} variant="outlined" size="small" />
        </CardContent>
        <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', px: 2.5 }}>
          <IconButton aria-label="add to favorites" color="primary" size="small" component={Link} to={`${id}/edit`}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="share" color="error" size="small" onClick={() => onDelete(id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Stack>
    </Stack>
  </MainCard>
);

export default ShowCard;
