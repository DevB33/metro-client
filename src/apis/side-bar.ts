import getInstance from '.';

export const createPage = async (parentId: string | null) => {
  const instance = await getInstance();
  await instance.post('/notes', { parentId });
};

export const deletePage = async (parentId: string) => {
  const instance = await getInstance();
  await instance.delete(`/notes/${parentId}`);
};

export const getPageList = async () => {
  const instance = await getInstance();
  const response = await instance.get(`/notes`);

  return response.data;
};
