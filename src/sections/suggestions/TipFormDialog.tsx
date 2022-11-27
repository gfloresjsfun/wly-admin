import { Button, OutlinedInput, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ITip } from 'types/suggestions';

interface TipFormDialogProps {
  onSubmit: (data: ITip) => void;
}

const TipFormDialog: React.FC<TipFormDialogProps> = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<ITip>();

  const handleTipSubmit: SubmitHandler<ITip> = (data) => {
    onSubmit(data);
    reset((formValues) => ({ ...formValues, description: '', title: '' }));
  };

  return (
    <MainCard>
      <Stack spacing={1}>
        <OutlinedInput id="tip-summary" {...register('summary', { required: true })} size="small" placeholder="Summary" />
        <OutlinedInput multiline id="tip-details" {...register('details', { required: true })} size="small" placeholder="Details" />

        <Stack direction="row" alignItems="end">
          <Button type="submit" size="small" color="primary" variant="contained" onClick={handleSubmit(handleTipSubmit)}>
            Add Tip
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default TipFormDialog;
