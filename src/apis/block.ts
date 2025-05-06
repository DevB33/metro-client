import getInstance from '.';

export const getBlockList = async (noteId: string) => {
  const instance = await getInstance();
  const response = await instance.get(`/blocks`, {
    params: {
      noteId,
    },
  });

  return response.data.blocks;
};

export const createBlock = async (body: any) => {
  const instance = await getInstance();
  await instance.post(`/blocks`, JSON.stringify(body));
};
