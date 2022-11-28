// react
import { useMemo } from 'react';
// mui
import { Grid } from '@mui/material';
// custom
import CollectionCard from 'components/cards/CollectionCard';
// types
import { ICollection } from 'types/collections';

const CollectionCardList: React.FC<{ items: ICollection[]; onDeleteItem: (id: string) => void }> = ({ items, onDeleteItem }) => {
  const itemEls = useMemo(
    () =>
      items.map((item) => (
        <Grid key={item.id} item xs={1} sm={6} md={4}>
          <CollectionCard item={item} onDelete={onDeleteItem} />
        </Grid>
      )),
    [items, onDeleteItem]
  );

  return (
    <Grid container spacing={3}>
      {itemEls}
    </Grid>
  );
};

export default CollectionCardList;
