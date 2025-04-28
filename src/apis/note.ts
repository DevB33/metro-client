import ITagType from '@/types/tag-type';
import getInstance from '.';

export const createNote = async (parentId: string | null) => {
  const instance = await getInstance();
  await instance.post('/documents', { parentId });
};

export const deleteNote = async (parentId: string) => {
  const instance = await getInstance();
  await instance.delete(`/documents/${parentId}`);
};

export const getNoteList = async () => {
  const instance = await getInstance();
  const response = await instance.get(`/documents`);

  return response.data;
};

export const editNoteIcon = async (noteId: string, selectedIcon: string | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/icon`,
    JSON.stringify({
      value: selectedIcon,
    }),
  );
};

export const editNoteCover = async (noteId: string, selectedColor: String | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/cover`,
    JSON.stringify({
      value: selectedColor,
    }),
  );
};

export const editNoteTitle = async (noteId: string, title: String | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/title`,
    JSON.stringify({
      value: title,
    }),
  );
};

export const editNoteTags = async (noteId: string, tags: ITagType[]) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/tags`,
    JSON.stringify({
      tags,
    }),
  );
};

export const getNoteInfo = async (noteId: string | null) => {
  const instance = await getInstance();
  const response = await instance.get(`/documents/${noteId}`);

  return response.data;
};
