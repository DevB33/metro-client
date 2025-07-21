import { ITextBlockChild } from '@/types/block-type';
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

export const createBlock = async (body: {
  noteId: string;
  type: string;
  upperOrder: number;
  nodes: ITextBlockChild[];
}) => {
  if (body.type === 'PAGE') {
    const instance = await getInstance();
    const newPage = {
      parentId: body.noteId,
      upperOrder: body.upperOrder,
    };
    await instance.post(`/notes`, JSON.stringify(newPage));
  } else {
    const instance = await getInstance();
    await instance.post(`/blocks`, JSON.stringify(body));
  }
};

export const updateBlockNodes = async (blockId: string, nodes: ITextBlockChild[]) => {
  const instance = await getInstance();
  await instance.patch(`/blocks/${blockId}/nodes`, JSON.stringify({ nodes }));
};

export const updateBlockType = async (blockId: string, type: string) => {
  const instance = await getInstance();
  await instance.patch(`/blocks/${blockId}/type`, JSON.stringify({ type }));
};

export const updateBlocksOrder = async (noteId: string, startOrder: number, endOrder: number, upperOrder: number) => {
  const instance = await getInstance();
  await instance.patch(`/blocks/order`, JSON.stringify({ noteId, startOrder, endOrder, upperOrder }));
};

export const getNoteDetail = async (noteId: string) => {
  const instance = await getInstance();
  const response = await instance.get(`/notes/${noteId}`);
  return response.data;
};

export const deleteBlock = async (noteId: string, startOrder: number, endOrder: number) => {
  const instance = await getInstance();
  await instance.delete(`/blocks`, {
    data: {
      noteId,
      startOrder,
      endOrder,
    },
  });
};
