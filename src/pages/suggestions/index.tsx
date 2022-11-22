import { useMemo, useState } from 'react';
import { CircularProgress, OutlinedInput, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import SuggestionCardList from 'sections/suggestions/SuggestionCardMasonry';
import { getSuggestions } from '_api/suggestions';
import useDeferredValue from 'hooks/utils/useDeferredValue';
import MainCard from 'components/MainCard';

const Suggestions: React.FC = () => {
  const { isLoading, data = [] } = useQuery({ queryKey: ['suggestions'], queryFn: getSuggestions });

  const [q, setQ] = useState('');
  const deferredQ = useDeferredValue(q);
  const items = useMemo(
    () => data.filter((item) => item.title.toLocaleLowerCase().includes(deferredQ.toLocaleLowerCase())),
    [data, deferredQ]
  );

  return (
    <Stack gap={3}>
      <MainCard>
        <OutlinedInput startAdornment={<SearchIcon />} value={q} onChange={(e) => setQ(e.target.value)} />
      </MainCard>

      {isLoading ? <CircularProgress /> : <SuggestionCardList items={items} onDeleteItem={() => {}} />}
    </Stack>
  );
};

export default Suggestions;
