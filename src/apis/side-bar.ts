import getInstance from '.';

export const createRootPage = async () => {
  const instance = await getInstance();
  await instance.post('/api/documents', { parentId: null });
};

export const createChildPage = async (parentId: string) => {
  const instance = await getInstance();
  await instance.post('/api/documents', { parentId });
};

export const deletePage = async (parentId: string) => {
  const instance = await getInstance();
  await instance.delete(`/api/documents/${parentId}`);
};
