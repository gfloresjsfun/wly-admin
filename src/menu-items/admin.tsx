// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Movie, Collections, AssistantPhoto, Folder } from '@mui/icons-material';

// type
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'Admin',
  title: <FormattedMessage id="admin" />,
  type: 'group',
  children: [
    {
      id: 'shows',
      title: 'Shows',
      type: 'item',
      url: '/shows',
      icon: Movie
    },
    {
      id: 'Albums',
      title: 'Albums',
      type: 'item',
      url: '/albums',
      icon: Collections
    },
    {
      id: 'suggestions',
      title: 'Suggestions',
      type: 'item',
      url: '/suggestions',
      icon: AssistantPhoto
    },
    {
      id: 'collections',
      title: 'Collections',
      type: 'item',
      url: '/collections',
      icon: Folder
    }
  ]
};

export default other;
