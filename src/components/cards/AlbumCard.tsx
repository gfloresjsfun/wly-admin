// react
import { useState } from 'react';
import { Link } from 'react-router-dom';
// mui
import { Box, CardMedia, Chip, Typography, IconButton, Stack, Menu, MenuItem, Fade, ListItemIcon, ListItemText } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// other
import formatDuration from 'format-duration';
// custom
import MainCard from 'components/MainCard';
// api
// types
import { AlbumCardProps } from 'types/albums';

// ==============================|| ALBUM CARD ||============================== //

const AlbumCard: React.FC<AlbumCardProps> = ({ item: { id, title, coverS3Url, shows }, onDelete }) => {
  const [showsMenuAnchorEl, setShowsMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openShowsMenu = Boolean(showsMenuAnchorEl);
  const handleShowsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setShowsMenuAnchorEl(event.currentTarget);
  };
  const handleShowsMenuClose = () => {
    setShowsMenuAnchorEl(null);
  };

  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openActionsMenu = Boolean(actionsMenuAnchorEl);
  const handleActionsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };
  const handleActionsMenuClose = () => {
    setActionsMenuAnchorEl(null);
  };

  return (
    <MainCard content={false} boxShadow>
      <Box sx={{ position: 'relative' }}>
        <CardMedia sx={{ height: 300 }} image={coverS3Url} />
        <Box sx={{ width: '100%', position: 'absolute', top: 0, padding: 2.5 }}>
          <Stack direction="row" justifyContent="space-between">
            <Chip
              icon={<PlayCircleOutlineIcon />}
              label={`${shows.length} Shows`}
              color="secondary"
              sx={{ background: 'rgba(0, 0, 0, 0.3)' }}
              onClick={handleShowsMenuOpen}
            />
            <IconButton
              edge="end"
              aria-label="comments"
              sx={{ background: 'rgba(0, 0, 0, 0.3)', color: 'white' }}
              onClick={handleActionsMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>

          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button'
            }}
            anchorEl={showsMenuAnchorEl}
            open={openShowsMenu}
            onClose={handleShowsMenuClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'top',
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

          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button'
            }}
            anchorEl={actionsMenuAnchorEl}
            open={openActionsMenu}
            onClose={handleActionsMenuClose}
            TransitionComponent={Fade}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem component={Link} to={`${id}/edit`}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => onDelete(id)}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ width: '100%', position: 'absolute', bottom: 0, padding: 2.5 }}>
          <Typography color="white" variant="h3">
            {title}
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

export default AlbumCard;
