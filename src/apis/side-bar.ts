import getInstance from '.';

export const createPage = async (parentId: string | null) => {
  const instance = await getInstance();
  await instance.post('/documents', { parentId });
};

export const deletePage = async (parentId: string) => {
  const instance = await getInstance();
  await instance.delete(`/documents/${parentId}`);
};

export const getPageList = async () => {
  const instance = await getInstance();
  const response = await instance.get(`/documents`);

  return response.data;
};
