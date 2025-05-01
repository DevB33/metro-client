import ISelectionPosition from '@/types/selection-position';
import { ITextBlock, ITextBlockChild } from '@/types/block-type';

const defaultStyle = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  color: '#000000',
  backgroundColor: 'transparent',
  width: 'auto',
  height: 'auto',
  borderRadius: '0',
};

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
            style: defaultStyle,
            content: '',
          },
        ];

  const secondChildren =
    secondRawChildren.length > 0
      ? secondRawChildren
      : [
          {
            type: 'text',
            style: defaultStyle,
            content: '',
          },
        ];

  const firstUpdatedBlock = {
    id: Math.random(),
    type: block.type,
    children: firstChildren as ITextBlock['children'],
  };
  const secondUpdatedBlock = {
    id: Math.random(),
    type: block.type,
    children: secondChildren as ITextBlock['children'],
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

const editSelectionContent = (
  selectionAction: string,
  key: string,
  selection: ISelectionPosition,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
) => {
  if (!blockRef.current) return;

  const { blockIndex: startBlockIndex, childNodeIndex: startNodeIndex, offset: startOffset } = selection.start;
  const { blockIndex: endBlockIndex, childNodeIndex: endNodeIndex, offset: endOffset } = selection.end;
  let newBlockList = [...blockList];

  const deleteIndex = [];

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

  // 블록 인덱스 범위
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
        const startNode = childNodes[startNodeIndex];
        const beforeText = startNode.textContent?.slice(0, startOffset <= endOffset ? startOffset : endOffset) || '';
        const afterText = startNode.textContent?.slice(startOffset <= endOffset ? endOffset : startOffset) || '';
        const beforeNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: beforeText,
        };
        const afterNode = {
          type: block.children[startNodeIndex].type,
          style: block.children[startNodeIndex].style,
          content: afterText,
        };

        if (selectionAction === 'write') {
          const rawChildren = [
            ...block.children.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            newNode,
            ...(afterText ? [afterNode] : []),
            ...block.children.slice(startNodeIndex + 1),
          ];
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '\u00A0';
          }
          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: defaultStyle,
                    content: '',
                  },
                ];
          const updatedBlock = {
            id: block.id,
            type: block.type,
            children: finalChildren as ITextBlock['children'],
          };
          newBlockList[index] = updatedBlock;
        }

        if (selectionAction === 'enter') {
          const firstRawChildren = [...block.children.slice(0, startNodeIndex), ...(beforeText ? [beforeNode] : [])];

          const secondRawChildren = [...(afterText ? [afterNode] : []), ...block.children.slice(startNodeIndex + 1)];

          newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index);
        }

        if (selectionAction === 'delete') {
          const rawChildren = [
            ...block.children.slice(0, startNodeIndex),
            ...(beforeText ? [beforeNode] : []),
            ...(afterText ? [afterNode] : []),
            ...block.children.slice(startNodeIndex + 1),
          ];

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: defaultStyle,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            children: finalChildren as ITextBlock['children'],
          };

          newBlockList[index] = updatedBlock;
        }
      }

      // 한 블록에서 여러 노드 선택된 경우
      else {
        // 선택 시작 노드 분리
        let selectionStartNode;
        let selectionEndNode;
        let selectionBeforeText;
        let selectionAfterText;
        if (startNodeIndex < endNodeIndex) {
          selectionStartNode = childNodes[startNodeIndex];
          selectionEndNode = childNodes[endNodeIndex];
          selectionBeforeText = selectionStartNode.textContent?.slice(0, startOffset) || '';
          selectionAfterText = selectionEndNode.textContent?.slice(endOffset) || '';
        } else {
          selectionStartNode = childNodes[endNodeIndex];
          selectionEndNode = childNodes[startNodeIndex];
          selectionBeforeText = selectionStartNode.textContent?.slice(0, endOffset) || '';
          selectionAfterText = selectionEndNode.textContent?.slice(startOffset) || '';
        }

        if (selectionAction === 'write') {
          let rawChildren: ITextBlock['children'] = [];
          if (startNodeIndex < endNodeIndex) {
            rawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
              newNode,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];
          }
          if (startNodeIndex > endNodeIndex) {
            rawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
              newNode,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(startNodeIndex + 1),
            ];
          }
          if (rawChildren.length === 1 && rawChildren[0].content === ' ') {
            rawChildren[0].content = '&nbsp;';
          }
          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: defaultStyle,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            children: finalChildren as ITextBlock['children'],
          };

          newBlockList[index] = updatedBlock;
        }

        if (selectionAction === 'enter') {
          let firstRawChildren: ITextBlock['children'] = [];
          let secondRawChildren: ITextBlock['children'] = [];
          if (startNodeIndex < endNodeIndex) {
            firstRawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
            ];

            secondRawChildren = [
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];
          }
          if (startNodeIndex > endNodeIndex) {
            firstRawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
            ];

            secondRawChildren = [
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(startNodeIndex + 1),
            ];
          }
          newBlockList = splitChildren(firstRawChildren, secondRawChildren, block, newBlockList, index);
        }

        if (selectionAction === 'delete') {
          let rawChildren: ITextBlock['children'] = [];

          if (startNodeIndex < endNodeIndex) {
            rawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];
          }
          if (startNodeIndex > endNodeIndex) {
            rawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(startNodeIndex + 1),
            ];
          }

          const finalChildren =
            rawChildren.length > 0
              ? rawChildren
              : [
                  {
                    type: 'text',
                    style: defaultStyle,
                    content: '',
                  },
                ];

          const updatedBlock = {
            id: block.id,
            type: block.type,
            children: finalChildren as ITextBlock['children'],
          };

          newBlockList[index] = updatedBlock;
        }
      }
    }

    // 여러 블록을 선택한 경우
    else {
      // 첫 블록인 경우
      if (startBlockIndex < endBlockIndex) {
        if (index === startBlockIndex) {
          // 선택 시작 노드 분리
          const selectionStartNode = childNodes[startNodeIndex];
          const selectionBeforeText = selectionStartNode.textContent?.slice(0, startOffset) || '';
          if (selectionAction === 'write') {
            const rawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];
            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };
            newBlockList[index] = updatedBlock;
          }
          if (selectionAction === 'enter') {
            const firstRawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
            ];
            newBlockList = splitChildren(firstRawChildren, [], block, newBlockList, index);
          }
          if (selectionAction === 'delete') {
            const rawChildren = [
              ...block.children.slice(0, startNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[startNodeIndex],
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            newBlockList[index] = updatedBlock;
          }
        }

        // 중간 블록인 경우
        if (index > startBlockIndex && index < endBlockIndex) {
          // 해당 블록 삭제
          deleteIndex.push(index);
        }

        // 끝 블록인 경우
        if (index === endBlockIndex) {
          // 선택 끝 노드 분리
          const selectionEndNode = childNodes[endNodeIndex];
          const selectionAfterText = selectionEndNode.textContent?.slice(endOffset) || '';
          if (selectionAction === 'write') {
            // 첫 블록 뒤에 붙이기
            const startBlock = newBlockList[startBlockIndex];
            const startBlockChildren = startBlock.children;

            const rawChildren = [
              ...startBlockChildren,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            // 첫 블록 위치에 넣고, 마지막 블록 삭제
            newBlockList[startBlockIndex] = updatedBlock;
            deleteIndex.push(index);
          }
          if (selectionAction === 'enter') {
            const secondRawChildren = [
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];
            newBlockList = splitChildren([], secondRawChildren, block, newBlockList, index);
          }
          if (selectionAction === 'delete') {
            // 첫 블록 뒤에 붙이기
            const startBlock = newBlockList[startBlockIndex];
            const startBlockChildren = startBlock.children;

            const rawChildren = [
              ...startBlockChildren,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];

            const finalChildren =
              rawChildren.length > 0
                ? rawChildren
                : [
                    {
                      type: 'text',
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            // 첫 블록 위치에 넣고, 마지막 블록 삭제
            newBlockList[startBlockIndex] = updatedBlock;
            deleteIndex.push(index);
          }
        }
      }
      if (startBlockIndex > endBlockIndex) {
        // 끝 블록인 경우
        if (index === endBlockIndex) {
          // 선택 시작 노드 분리
          const selectionStartNode = childNodes[endNodeIndex];
          const selectionBeforeText = selectionStartNode.textContent?.slice(0, endOffset) || '';
          if (selectionAction === 'write') {
            const rawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];
            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };
            newBlockList[endBlockIndex] = updatedBlock;
          }
          if (selectionAction === 'enter') {
            const firstRawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionBeforeText,
                    },
                  ]
                : []),
            ];
            newBlockList = splitChildren(firstRawChildren, [], block, newBlockList, index);
          }
          if (selectionAction === 'delete') {
            const rawChildren = [
              ...block.children.slice(0, endNodeIndex),
              ...(selectionBeforeText
                ? [
                    {
                      ...block.children[endNodeIndex],
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            newBlockList[index] = updatedBlock;
          }
        }

        // 중간 블록인 경우
        if (index < startBlockIndex && index > endBlockIndex) {
          // 해당 블록 삭제
          deleteIndex.push(index);
        }

        // 끝 블록인 경우
        if (index === startBlockIndex) {
          // 선택 끝 노드 분리
          const selectionEndNode = childNodes[startNodeIndex];
          const selectionAfterText = selectionEndNode.textContent?.slice(startOffset) || '';
          if (selectionAction === 'write') {
            // 첫 블록 뒤에 붙이기
            const startBlock = newBlockList[endBlockIndex];
            const startBlockChildren = startBlock.children;

            const rawChildren = [
              ...startBlockChildren,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
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
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            // 첫 블록 위치에 넣고, 마지막 블록 삭제
            newBlockList[endBlockIndex] = updatedBlock;
            deleteIndex.push(index);
          }
          if (selectionAction === 'enter') {
            const secondRawChildren = [
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[startBlockIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(startBlockIndex + 1),
            ];
            newBlockList = splitChildren([], secondRawChildren, block, newBlockList, index);
          }
          if (selectionAction === 'delete') {
            // 첫 블록 뒤에 붙이기
            const startBlock = newBlockList[endBlockIndex];
            const startBlockChildren = startBlock.children;

            const rawChildren = [
              ...startBlockChildren,
              ...(selectionAfterText
                ? [
                    {
                      ...block.children[endNodeIndex],
                      content: selectionAfterText,
                    },
                  ]
                : []),
              ...block.children.slice(endNodeIndex + 1),
            ];

            const finalChildren =
              rawChildren.length > 0
                ? rawChildren
                : [
                    {
                      type: 'text',
                      style: defaultStyle,
                      content: '',
                    },
                  ];

            const updatedBlock = {
              id: block.id,
              type: block.type,
              children: finalChildren as ITextBlock['children'],
            };

            // 첫 블록 위치에 넣고, 마지막 블록 삭제
            newBlockList[endBlockIndex] = updatedBlock;
            deleteIndex.push(index);
          }
        }
      }
    }
  }
  // 블록 삭제
  deleteIndex
    .sort((a, b) => b - a)
    .forEach(index => {
      newBlockList.splice(index, 1);
    });

  setBlockList(newBlockList);
};

export default editSelectionContent;
