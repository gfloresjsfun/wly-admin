import { Button, FormHelperText, OutlinedInput, Stack } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MainCard from 'components/MainCard';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ITip } from 'types/suggestions';

interface TipFormProps {
  initialValues?: ITip;
  onSubmit: (data: ITip) => void;
  onCancel: () => void;
}

const schema = yup
  .object()
  .shape({
    summary: yup.string().required(),
    details: yup.string().required()
  })
  .required();

const TipForm: React.FC<TipFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors }
  } = useForm<ITip>({ defaultValues: { ...initialValues }, resolver: yupResolver(schema) });

  const handleTipSubmit: SubmitHandler<ITip> = (data) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    reset({ ...initialValues });
    onCancel();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...initialValues });
    }
  }, [isSubmitSuccessful, initialValues, reset]);

  return (
    <MainCard>
      <Stack spacing={1}>
        <OutlinedInput {...register('summary', { required: true })} size="small" placeholder="Summary" />
        {errors.summary && <FormHelperText error>{errors.summary.message}</FormHelperText>}

        <OutlinedInput multiline {...register('details', { required: true })} size="small" placeholder="Details" />
        {errors.details && <FormHelperText error>{errors.details.message}</FormHelperText>}

        <Stack direction="row" alignItems="end" gap={1}>
          <Button type="submit" size="small" color="primary" variant="contained" onClick={handleSubmit(handleTipSubmit)}>
            Save
          </Button>
          <Button type="button" size="small" color="error" variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
};

export default TipForm;
