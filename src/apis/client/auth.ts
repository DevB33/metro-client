import getInstance from '.';

// eslint-disable-next-line import/prefer-default-export
export const logout = async () => {
  const instance = await getInstance();
  await instance.post('/api/auth/logout');
};
