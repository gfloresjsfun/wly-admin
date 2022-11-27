import { Button, OutlinedInput, Stack } from '@mui/material';
import MainCard from 'components/MainCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ITip } from 'types/suggestions';

interface TipFormProps {
  initialValues?: ITip;
  onSubmit: (data: ITip) => void;
  onCancel: () => void;
}

const TipForm: React.FC<TipFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset } = useForm<ITip>({
    defaultValues: initialValues
  });

  const handleTipSubmit: SubmitHandler<ITip> = (data) => {
    onSubmit(data);
    reset((formValues) => ({ ...formValues, description: '', title: '' }));
  };

  return (
    <MainCard>
      <Stack spacing={1}>
        <OutlinedInput {...register('summary', { required: true })} size="small" placeholder="Summary" />
        <OutlinedInput multiline {...register('details', { required: true })} size="small" placeholder="Details" />

        <Stack direction="row" alignItems="end" gap={1}>
          <Button type="submit" size="small" color="primary" variant="contained" onClick={handleSubmit(handleTipSubmit)}>
            Save
          </Button>
          <Button type="button" size="small" color="error" variant="contained" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default TipForm;
