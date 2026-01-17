import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { login, clearError } from '../../services/slices/auth-slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, user } = useSelector((state) => state.auth);
  const from = location.state?.from || { pathname: '/' };

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      return;
    }

    dispatch(login({ email: values.email, password: values.password }))
      .unwrap()
      .then(() => {
        console.log('Login successful');
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  if (isLoading) {
    return <Preloader />;
  }

  const handleEmailChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    const nextValue = typeof value === 'function' ? value(values.email) : value;
    handleChange({
      target: { name: 'email', value: nextValue }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handlePasswordChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    const nextValue =
      typeof value === 'function' ? value(values.password) : value;
    handleChange({
      target: { name: 'password', value: nextValue }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={handleEmailChange}
      password={values.password}
      setPassword={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};
