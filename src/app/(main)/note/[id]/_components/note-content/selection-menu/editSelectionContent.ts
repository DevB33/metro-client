import { mutate } from 'swr';

import { getNoteList } from '@/apis/client/note';
import { createBlock, deleteBlock, getBlockList, updateBlockNodes, updateBlocksOrder } from '@/apis/client/block';
import ISelectionPosition from '@/types/selection-position';
import { ITextBlock, ITextBlockChild } from '@/types/block-type';
import SWR_KEYS from '@/constants/swr-keys';
import DEFAULT_STYLE from '@/constants/child-node-style';

const splitChildren = (
  firstRawChildren: ITextBlockChild[],
  secondRawChildren: ITextBlockChild[],
  block: ITextBlock,
  newBlockList: ITextBlock[],
  index: number,
) => {
  const firstChildren =
    firstRawChildren.length > 0
      ? firstRawChildren
      : [
          {
            type: 'text',
            style: DEFAULT_STYLE,
            content: '',
          },
        ];

  const secondChildren =
    secondRawChildren.length > 0
      ? secondRawChildren
      : [
          {
            type: 'text',
            style: DEFAULT_STYLE,
            content: '',
          },
        ];

  const firstUpdatedBlock = {
    id: block.id,
    type: block.type,
    nodes: firstChildren as ITextBlock['nodes'],
    order: block.order,
  };
  const secondUpdatedBlock = {
    id: block.id,
    type: block.type,
    nodes: secondChildren as ITextBlock['nodes'],
    order: block.order + 1,
  };

  // children이 비어있는 경우 제외하고 추가
  const updatedBlocks: ITextBlock[] = [];
  if (firstRawChildren.length > 0) {
    updatedBlocks.push(firstUpdatedBlock);
  }
  if (secondRawChildren.length > 0) {
    updatedBlocks.push(secondUpdatedBlock);
  }

  const splitedBlockList = [...newBlockList.slice(0, index), ...updatedBlocks, ...newBlockList.slice(index + 1)];

  return splitedBlockList;
};

const editSelectionContent = async (
  selectionAction: string,
  noteId: string,
  key: string,
  selection: ISelectionPosition,
  isBackward: boolean,
  blockList: ITextBlock[],
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  const {
    blockId: startBlockId,
    blockIndex: startBlockIndex,
    childNodeIndex: startNodeIndex,
    offset: startOffset,
  } = !isBackward ? selection.start : selection.end;
  const {
    blockIndex: endBlockIndex,
    childNodeIndex: endNodeIndex,
    offset: endOffset,
  } = !isBackward ? selection.end : selection.start;
  let newBlockList = [...blockList];

  const newNode = {
    type: 'text' as 'text',
    style: {
      fontStyle: 'normal',
      fontWeight: 'regular',
      textDecoration: 'none',
      color: 'black',
      backgroundColor: 'white',
      width: 'auto',
      height: 'auto',
      borderRadius: '0',
    },
    content: key,
  };

  const emptyRawChildren = [
    {
      type: 'text' as const,
      style: DEFAULT_STYLE,
      content: '',
    },
  ];
  // 블록 인덱스 범위
  // for문이 start와 end의 순서가 바뀐 역방향 selection에서도 잘 작동하도록 구현
  // refactor: Promise.all 적용 할지
  for (
    let index = Math.min(startBlockIndex, endBlockIndex);
    index <= Math.max(startBlockIndex, endBlockIndex);
    index += 1
  ) {
    const block = blockList[index];
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    // 한 블록만 선택한 경우
    if (startBlockIndex === endBlockIndex) {
      // 한 노드 안에서만 선택된 경우
      if (startNodeIndex === endNodeIndex) {
        //
        const startNode = childNodes[startNodeIndex]; // startNodeIndex와 endNodeIndex가 같기에 임의로 startNodeIndex로 설정

        const beforeText = startNode.textContent?.slice(0, startOffset) || '';
        const afterText = startNode.textContent?.slice(endOffset) || '';
        const beforeNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: beforeText,
        };
        const afterNode = {
          type: block.nodes[startNodeIndex].type,
          style: block.nodes[startNodeIndex].style,
          content: afterText,
        };

        // 한 노드 내에서 이전 텍스트와 다음 텍스트 사이에 새로운 문자 삽입
        if (selectionAction === 'write') {
          const rawChildren = [
            ...block.nodes.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            newNode,
            ...(afterText ? [afterNode] : []),
            ...block.nodes.slice(startNodeIndex + 1),
          ];
          // 모두 지워졌을 경우, block에 다시 입력이 가능하도록 예외처리
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '\u00A0';
          }
          const finalChildren =
            rawChildren.length > 0
              ? rawChildren.map(child => ({
                  ...child,
                  style: child.style ?? DEFAULT_STYLE,
                }))
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];
          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
          // eslint-disable-next-line no-await-in-loop
          await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
        }

        // 한 노드 내에서 이전 텍스트와 다음 텍스트를 분리, selection된 부분은 list에서 제외 후 블록 분리
        if (selectionAction === 'enter') {
          const firstRawChildren = [
            ...block.nodes.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : emptyRawChildren),
          ];

          const secondRawChildren = [
            ...(afterText ? [afterNode] : emptyRawChildren),
            ...block.nodes.slice(startNodeIndex + 1),
          ];

          newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index);
          // 현재 블록 업데이트
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(newBlockList[index].id, newBlockList[index].nodes);

          // 현재 블록 이후 블록 뒤로 한칸씩 미루기
          // eslint-disable-next-line no-await-in-loop
          await updateBlocksOrder(
            noteId,
            newBlockList[index + 1].order,
            newBlockList[blockList.length - 1].order,
            newBlockList[index + 1].order,
          );

          // 현재 블록 바로 뒤에 블록 생성
          // eslint-disable-next-line no-await-in-loop
          await createBlock({
            noteId,
            type: 'DEFAULT',
            upperOrder: newBlockList[index].order,
            nodes: newBlockList[index + 1].nodes,
          });

          // eslint-disable-next-line no-await-in-loop
          await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
        }

        // 한 노드 내에서 이전 텍스트와 다음 텍스트를 분리, selection된 부분은 list에서 제외
        if (selectionAction === 'delete') {
          const rawChildren = [
            ...block.nodes.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            ...(afterText ? [afterNode] : []),
            ...block.nodes.slice(startNodeIndex + 1),
          ];

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          newBlockList[index] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
        }
      }

      // 한 블록내에서 여러 노드 선택된 경우
      else {
        // selection이 시작된 노드와 끝난 노드, 각 노드에서 이전 Text와 이후 Text를 변수에 저장
        // ex) 111[2|22][33|3]444 -> 222와 333은 selection의 start,end Node, 2233을 selection한 상태에서 beforText는 2, afterText는 3
        // 만약 노드가 여러개더라도, selection에 포함되면 입력, 삭제, enter 시 제거되어야 하기 때문에 시작과 끝 노드만 저장

        const selectionStartNodeIndex = startNodeIndex;
        const selectionEndNodeIndex = endNodeIndex;
        const selectionStartNode = childNodes[selectionStartNodeIndex];
        const selectionEndNode = childNodes[selectionEndNodeIndex];
        const selectionBeforeText = selectionStartNode.textContent?.slice(0, startOffset) || '';
        const selectionAfterText = selectionEndNode.textContent?.slice(endOffset) || '';

        // 여러 노드를 selection 한 상태로 글자 입력
        if (selectionAction === 'write') {
          let rawChildren: ITextBlock['nodes'] = [];
          rawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex), // selection에 포함되지 않은 이전 노드
            ...(selectionBeforeText // selection에 포함된 시작 노드에서 selection 된 문자는 제거하고 befor text만 남김
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText,
                  },
                ]
              : []),
            newNode, // 새로운 노드 추가
            ...(selectionAfterText // selection에 포함된 마지막 노드에서 selection 된 문자는 제거하고 befor text만 남김
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText,
                  },
                ]
              : []),
            ...block.nodes.slice(selectionEndNodeIndex + 1), // selection에 포함되지 않은 이전 노드
          ];

          // 모두 지워졌을 경우, block에 다시 입력이 가능하도록 예외처리
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '&nbsp;';
          }
          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          // block의 형태로 mapping
          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          newBlockList[index] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
        }

        // 여러 노드를 selection 한 상태로 enter 입력
        // selection 된 부분을 전부 지우고 블록 나눔
        if (selectionAction === 'enter') {
          // 위에 남아있을 firstRaw, 아래줄로 이동할 secondRaw
          let firstRawChildren: ITextBlock['nodes'] = [];
          let secondRawChildren: ITextBlock['nodes'] = [];

          // 윗줄에 남아있을 블록
          firstRawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex), // selection에 포함되지 않은 노드
            ...(selectionBeforeText // selection에 포함된 가장 앞 노드에서 selection 되지 않은 text만 남김
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText,
                  },
                ]
              : emptyRawChildren),
          ];

          secondRawChildren = [
            ...(selectionAfterText
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText, // selection에 포함된 가장 뒷 노드에서 selection 되지 않은 text만 남김
                  },
                ]
              : emptyRawChildren),
            ...block.nodes.slice(selectionEndNodeIndex + 1), // selection에 포함되지 않은 노드
          ];

          newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index); // 블록 분리
          // 현재 블록 업데이트
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(newBlockList[index].id, newBlockList[index].nodes);

          // 현재 블록 이후 블록 뒤로 한칸씩 미루기
          // eslint-disable-next-line no-await-in-loop
          await updateBlocksOrder(
            noteId,
            newBlockList[index + 1].order,
            newBlockList[blockList.length - 1].order,
            newBlockList[index + 1].order,
          );

          // 현재 블록 바로 뒤에 블록 생성
          // eslint-disable-next-line no-await-in-loop
          await createBlock({
            noteId,
            type: 'DEFAULT',
            upperOrder: newBlockList[index].order,
            nodes: newBlockList[index + 1].nodes,
          });
        }

        // 여러 노드를 selection 한 상태로 backSpace 입력
        // selection 된 부분을 전부 지움
        if (selectionAction === 'delete') {
          let rawChildren: ITextBlock['nodes'] = [];

          rawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex), // selection에 포함되지 않은 노드
            ...(selectionBeforeText
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText, // selection에 포함된 가장 앞 노드에서 selection 되지 않은 text만 남김
                  },
                ]
              : []),
            ...(selectionAfterText
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText, // selection에 포함된 가장 뒷 노드에서 selection 되지 않은 text만 남김
                  },
                ]
              : []),
            ...block.nodes.slice(selectionEndNodeIndex + 1), // selection에 포함되지 않은 노드
          ];

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          newBlockList[index] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
        }
      }
    }

    // 여러 블록을 선택한 경우
    // note : for문의 index에 따른 로직이므로 아래 로직이 거의 흡사하나 합치지 못함 추후 리팩토링 시 고려
    else {
      // selection의 가장 위 블록
      if (index === startBlockIndex) {
        // 가장 윗 블록의 selection 시작 index 및, 이전 text 저장
        const selectionStartNodeIndex = startNodeIndex;
        const selectionStartNode = childNodes[selectionStartNodeIndex];
        const selectionBeforeText = selectionStartNode.textContent?.slice(0, startOffset) || '';
        // 여러 블록 selection 상태에서 입력, enter, 삭제 시 가장 윗줄은 이전 노드 + 이전 텍스트 + 새로 입력한 값 저장
        if (selectionAction === 'write') {
          const rawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex),
            ...(selectionBeforeText
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText,
                  },
                ]
              : []),
            newNode,
          ];
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '&nbsp;';
          }
          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];
          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          newBlockList[startBlockIndex] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
        }
        if (selectionAction === 'enter') {
          const firstRawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex),
            ...(selectionBeforeText
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText,
                  },
                ]
              : emptyRawChildren),
          ];
          newBlockList = splitChildren(firstRawChildren, [], block, newBlockList, index);

          // 현재 블록 업데이트
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(newBlockList[index].id, newBlockList[index].nodes);
        }
        if (selectionAction === 'delete') {
          const rawChildren = [
            ...block.nodes.slice(0, selectionStartNodeIndex),
            ...(selectionBeforeText
              ? [
                  {
                    ...block.nodes[selectionStartNodeIndex],
                    content: selectionBeforeText,
                  },
                ]
              : []),
          ];

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          newBlockList[index] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(block.id, updatedBlock.nodes);
        }
      }

      // seleciton의 중간 블록은 어떤 action이던, 전부 제거
      if (index > startBlockIndex && index < endBlockIndex) {
        // 해당 블록 삭제
        // deleteIndex.push(index);
        // eslint-disable-next-line no-await-in-loop
        await deleteBlock(noteId, blockList[index].order, blockList[index].order);
      }

      // selection의 가장 아래 블록
      if (index === endBlockIndex) {
        // 가장 아래 블록의 selection 마지막 index 및, 이후 text 저장
        const selectionEndNodeIndex = endNodeIndex;
        const selectionEndNode = childNodes[selectionEndNodeIndex];
        const selectionAfterText = selectionEndNode.textContent?.slice(endOffset) || '';
        // 입력 시, 위 로직에서 만들어진 윗 블록에 이후 블록내용을 합쳐 마무리
        if (selectionAction === 'write') {
          // 가장 윗 블록 뒤에 붙이기
          const startBlock = newBlockList[startBlockIndex];
          const startBlockChildren = startBlock.nodes;

          const rawChildren = [
            ...startBlockChildren, // startBlockIndex에서 만들어진 block
            ...(selectionAfterText
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText,
                  },
                ]
              : []),
            ...block.nodes.slice(selectionEndNodeIndex + 1),
          ];
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '&nbsp;';
          }

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          // 첫 블록 위치에 넣고, 마지막 블록 삭제
          newBlockList[startBlockIndex] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(startBlockId, updatedBlock.nodes);
          // eslint-disable-next-line no-await-in-loop
          await deleteBlock(noteId, blockList[index].order, blockList[index].order);
        }
        // enter 시, 위 로직에서 만들어진 블록과, 이후 블록을 분리
        if (selectionAction === 'enter') {
          const secondRawChildren = [
            ...(selectionAfterText
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText,
                  },
                ]
              : emptyRawChildren),
            ...block.nodes.slice(selectionEndNodeIndex + 1),
          ];
          newBlockList = splitChildren([], secondRawChildren, block, newBlockList, index);

          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(newBlockList[index].id, newBlockList[index].nodes);
        }

        // 입력 시, 위 로직에서 만들어진 윗 블록에 이후 블록내용을 합쳐 마무리
        if (selectionAction === 'delete') {
          // 첫 블록 뒤에 붙이기
          const startBlock = newBlockList[startBlockIndex];
          const startBlockChildren = startBlock.nodes;

          const rawChildren = [
            ...startBlockChildren,
            ...(selectionAfterText
              ? [
                  {
                    ...block.nodes[selectionEndNodeIndex],
                    content: selectionAfterText,
                  },
                ]
              : []),
            ...block.nodes.slice(selectionEndNodeIndex + 1),
          ];

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: DEFAULT_STYLE,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            nodes: finalChildren as ITextBlock['nodes'],
            order: block.order,
          };

          // 첫 블록 위치에 넣고, 마지막 블록 삭제
          newBlockList[startBlockIndex] = updatedBlock;
          // eslint-disable-next-line no-await-in-loop
          await updateBlockNodes(startBlockId, updatedBlock.nodes);
          // eslint-disable-next-line no-await-in-loop
          await deleteBlock(noteId, blockList[index].order, blockList[index].order);
        }
      }
    }
  }

  // eslint-disable-next-line no-await-in-loop
  await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
  await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
};

export default editSelectionContent;
