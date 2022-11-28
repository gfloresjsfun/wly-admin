// react
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
// mui
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Fade
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// other
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// custom
import MainCard from 'components/MainCard';
// types
import { ICollection } from 'types/collections';
import { IAlbum } from 'types/albums';
import { IShow } from 'types/shows';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

interface PlayableCardProps {
  item: IShow | IAlbum;
}

const PlayableCard: React.FC<PlayableCardProps> = ({ item: { title, coverS3Url } }) => (
  <Card sx={{ position: 'relative', m: 1 }}>
    <CardMedia image={coverS3Url} component="img" />
    <Box sx={{ width: '100%', position: 'absolute', bottom: 0, padding: 2.5 }}>
      <Typography color="white" variant="h6">
        {title}
      </Typography>
    </Box>
  </Card>
);

interface CollectionCardProps {
  item: ICollection;
  onDelete: (id: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ item: { id, title, playables }, onDelete }) => {
  const playableElms = useMemo(() => playables.map(({ playable }, idx) => <PlayableCard key={playable.id} item={playable} />), [playables]);

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
      <CardHeader
        title={title}
        action={
          <IconButton aria-label="settings" onClick={handleActionsMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        }
      />
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
      <CardContent sx={{ paddingTop: 0 }}>
        <Carousel responsive={responsive}>{playableElms}</Carousel>
      </CardContent>
    </MainCard>
  );
};

export default CollectionCard;
