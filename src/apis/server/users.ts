import getInstance from '.';

export const getUserInfo = async () => {
  const instance = await getInstance();
  const response = await instance.get(`/members`);

  return response.data;
};

export default getUserInfo;
