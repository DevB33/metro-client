import getInstance from '.';

export const getNoteList = async () => {
  const instance = await getInstance();
  const response = await instance.get(`/notes`);

  return response.data;
};

export const getNoteInfo = async (noteId: string | null) => {
  const instance = await getInstance();
  const response = await instance.get(`/notes/${noteId}`);

  return response.data;
};
