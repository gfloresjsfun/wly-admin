import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// project import
import useAuth from 'hooks/useAuth';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Credentials } from 'types/auth';
import { openSnackbar } from 'store/reducers/snackbar';
import { useDispatch } from 'store';

// ============================|| FIREBASE - LOGIN ||============================ //

const schema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().max(255).required('Password is required')
});

const AuthLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Credentials>({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();

  const [checked, setChecked] = React.useState(false);
  const [capsWarning, setCapsWarning] = React.useState(false);

  const { isLoggedIn, login } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: any) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  const handleLogin: SubmitHandler<Credentials> = async ({ email, password }) => {
    try {
      await login(email, password).then(() => {});
    } catch (err: any) {
      dispatch(openSnackbar({ open: true, variant: 'alert', alert: { color: 'error' }, message: err.response.data, close: 'false' }));
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(handleLogin)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-login">Username</InputLabel>
            <OutlinedInput id="email-login" type="email" placeholder="Enter email" fullWidth {...register('email', { required: true })} />
            {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-login">Password</InputLabel>
            <OutlinedInput
              fullWidth
              color={capsWarning ? 'warning' : 'primary'}
              type={showPassword ? 'text' : 'password'}
              id="password-login"
              {...register('password', { required: 'true' })}
              name="password"
              onKeyDown={onKeyDown}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="secondary"
                  >
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Enter password"
            />
            {capsWarning && (
              <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                Caps lock on!
              </Typography>
            )}
            {errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password.message}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} sx={{ mt: -1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="h6">Keep me sign in</Typography>}
            />
            <Link variant="h6" component={RouterLink} to={isLoggedIn ? '/auth/forgot-password' : '/forgot-password'} color="text.primary">
              Forgot Password?
            </Link>
          </Stack>
        </Grid>
        {/* {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
        <Grid item xs={12}>
          <AnimateButton>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
              Login
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default AuthLogin;
