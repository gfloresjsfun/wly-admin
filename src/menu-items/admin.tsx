// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Movie } from '@mui/icons-material';

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
    }
  ]
};

export default other;
