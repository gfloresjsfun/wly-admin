import { useState } from 'react';
import formatDuration from 'format-duration';

// material-ui
import { Box, CardMedia, Chip, Typography, CardContent, IconButton, Stack, Menu, MenuItem, Fade } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// types
import { AlbumCardProps } from 'types/albums';

// project import
import MainCard from 'components/MainCard';

// ==============================|| ALBUM CARD ||============================== //

const AlbumCard = ({ title, coverS3Url, shows }: AlbumCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard content={false} boxShadow>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ width: 300, m: 'auto' }}>
          <CardMedia sx={{ height: 300 }} image={coverS3Url} />
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', top: 0, pt: 2.5, pl: 3, pr: 1 }}>
          <Chip
            icon={<PlayCircleOutlineIcon />}
            label={`${shows.length} Shows`}
            color="secondary"
            sx={{ background: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleMenuClick}
          />
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button'
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            {shows.map((show) => (
              <MenuItem key={show.id}>{`${show.title} (${formatDuration(show.duration * 1000)})`}</MenuItem>
            ))}
          </Menu>
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, pb: 2.5, pl: 3, pr: 1 }}>
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
