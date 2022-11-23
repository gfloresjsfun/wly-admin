import { useMemo, useState } from 'react';
import { Button, CircularProgress, OutlinedInput, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SuggestionCardMasonry from 'sections/suggestions/SuggestionCardMasonry';
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
        <Stack direction="row" justifyContent="space-between">
          <OutlinedInput startAdornment={<SearchIcon />} value={q} onChange={(e) => setQ(e.target.value)} />
          <Button component={Link} to="create" color="primary" variant="contained">
            <AddIcon /> New
          </Button>
        </Stack>
      </MainCard>

      {isLoading ? <CircularProgress /> : <SuggestionCardMasonry items={items} onDeleteItem={() => {}} />}
    </Stack>
  );
};

export default Suggestions;
