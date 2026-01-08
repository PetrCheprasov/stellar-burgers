import { FC, SyntheticEvent, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { register, clearError } from '../../services/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '../../components/ui';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!values.email || !values.password || !values.userName) {
      return;
    }

    dispatch(
      register({
        email: values.email,
        password: values.password,
        name: values.userName
      })
    )
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Registration failed:', err);
      });
  };

  const handleUserNameChange: React.Dispatch<React.SetStateAction<string>> = (
    value
  ) => {
    const nextValue =
      typeof value === 'function' ? value(values.userName) : value;
    handleChange({
      target: { name: 'userName', value: nextValue }
    } as React.ChangeEvent<HTMLInputElement>);
  };

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

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={handleEmailChange}
      setPassword={handlePasswordChange}
      setUserName={handleUserNameChange}
      handleSubmit={handleSubmit}
    />
  );
};
