import { FC } from 'react';
import { AppHeaderUI } from '../ui/app-header/app-header';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/slices/auth-slice';

const AppHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth?.user);

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    navigate('/profile');
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ошибка при выходе:', error);
      });
  };

  return (
    <AppHeaderUI
      userName={user ? user.name : undefined}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
      onLogoutClick={handleLogout}
    />
  );
};

export default AppHeader;
