import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { accountService } from '../services/account';
import { authService } from '../../../../services/auth';

export function useAccount() {
  const [user, setUser] = useState(authService.getUser());
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      setLoadingUser(true);
      const res = await accountService.getProfile();
      const profile = res.data?.user;

      if (profile) {
        setUser(profile);
        authService.updateUser(profile);
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    user,
    setUser,
    loadingUser,
    refreshProfile,
  };
}