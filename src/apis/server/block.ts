import getInstance from '.';

export const getBlockList = async (noteId: string) => {
  const instance = await getInstance();
  const response = await instance.get(`/blocks`, {
    params: {
      noteId,
    },
  });

  return response.data;
};

export default getBlockList;
