import { Add } from '@mui/icons-material';
import { Stack } from '@mui/material';
import MainCard from 'components/MainCard';

const Suggestions: React.FC = () => {
  return (
    <Stack spacing={2}>
      <MainCard>
        <Add /> Add
      </MainCard>
    </Stack>
  );
};

export default Suggestions;
