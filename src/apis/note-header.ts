import ITagType from '@/types/tag-type';
import getInstance from '.';

export const editIcon = async (noteId: string, selectedIcon: string | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/icon`,
    JSON.stringify({
      value: selectedIcon,
    }),
  );
};

export const editCover = async (noteId: string, selectedColor: String | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/cover`,
    JSON.stringify({
      value: selectedColor,
    }),
  );
};

export const editTitle = async (noteId: string, title: String | null) => {
  const instance = await getInstance();
  await instance.patch(
    `/documents/${noteId}/title`,
    JSON.stringify({
      value: title,
    }),
  );
};

export const editTags = async (noteId: string, tags: ITagType[]) => {
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
  console.log(response.data);

  return response.data;
};
