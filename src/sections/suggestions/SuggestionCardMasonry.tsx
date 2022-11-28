// react
import { useMemo } from 'react';
// mui
import Masonry from '@mui/lab/Masonry';
// custom
import SuggestionCard from 'components/cards/SuggestionCard';
// types
import { ISuggestion } from 'types/suggestions';

const SuggestionCardMasonry: React.FC<{ items: ISuggestion[]; onDeleteItem: (id: string) => void }> = ({ items, onDeleteItem }) => {
  const itemEls = useMemo(
    () => items.map((item) => <SuggestionCard key={item.id} item={item} onDelete={onDeleteItem} />),
    [items, onDeleteItem]
  );

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
      {itemEls}
    </Masonry>
  );
};

export default SuggestionCardMasonry;
