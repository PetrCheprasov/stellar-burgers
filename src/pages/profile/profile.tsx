import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser, clearError } from '../../services/slices/auth-slice';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const {
    values: formValue,
    handleChange,
    setValue,
    setValues
  } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user, setValues]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    dispatch(updateUser(updateData))
      .unwrap()
      .then(() => {
        setValue('password', '');
      })
      .catch((err) => {
        console.error('Update failed:', err);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
