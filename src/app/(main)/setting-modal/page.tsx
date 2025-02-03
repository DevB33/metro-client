'use client';

import { useRouter } from 'next/navigation';

const Settings = () => {
  const router = useRouter();
  router.replace('/');

  return null;
};

export default Settings;
