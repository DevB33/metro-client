import getInstance from '.';

const createRootPage = async () => {
  const instance = await getInstance();
  await instance.post('/api/documents', { parentId: null });
};

export default createRootPage;
