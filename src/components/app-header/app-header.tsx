import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { getUserState } from '../../services/slices/userSlice/userSlice';

const AppHeaderComponent: FC = () => {
  const { userData } = useSelector(getUserState);
  const userName = userData?.name || '';
  return <AppHeaderUI userName={userName} />;
};

export const AppHeader = AppHeaderComponent;
