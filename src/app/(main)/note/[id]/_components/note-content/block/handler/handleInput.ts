import { ITextBlock } from '@/types/block-type';
import getSelectionInfo from '@/utils/getSelectionInfo';
import { combineHangul } from 'hangul-util';

const handleInput = (
  event: React.FormEvent<HTMLDivElement>,
  index: number,
  blockList: ITextBlock[],
  setBlockList: (blockList: ITextBlock[]) => void,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  prevChildNodesLength: React.RefObject<number>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const updatedBlockList = [...blockList];
  console.log(updatedBlockList);
  let target;
  if (blockList[index].type === 'ol' || blockList[index].type === 'ul') {
    target = event.currentTarget.childNodes[0]?.childNodes[0]?.childNodes[0] as HTMLElement;
  } else if (blockList[index].type === 'quote') {
    target = event.currentTarget.childNodes[0]?.childNodes[0] as HTMLElement;
  } else {
    target = event.currentTarget.childNodes[0] as HTMLElement;
  }

  target.setAttribute('data-empty', 'false');

  const { startOffset, startContainer } = getSelectionInfo(0) || {};
  if (startOffset === undefined || startOffset === null || !startContainer) return;

  const childNodes = Array.from(target.childNodes as NodeListOf<HTMLElement>);
  const currentChildNodeIndex =
    childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
      : childNodes.indexOf(startContainer as HTMLElement);

  if (childNodes.length === 1 && target.textContent === '') {
    target.setAttribute('data-empty', 'true');
  }

  // 블록에 모든 내용이 지워졌을 때 빈 블록으로 변경 로직
  if (currentChildNodeIndex === -1 && blockRef.current[index] && childNodes.length === 1) {
    updatedBlockList[index].children[0] = {
      type: 'text',
      content: '',
    };
  }

  // block의 자식 노드가 지워졌을 때 blockList에 반영하는 로직
  if (prevChildNodesLength.current > childNodes.length && currentChildNodeIndex !== -1) {
    updatedBlockList[index].children.splice(currentChildNodeIndex + 1, 1);
  }

  if (currentChildNodeIndex !== -1 && updatedBlockList[index].children[currentChildNodeIndex].type === 'br') {
    if (currentChildNodeIndex !== childNodes.length - 1) {
      // "안녕"<br><br>"하세요" 이 구조에서는 중간의 빈 줄에 text 입력 시 <br>과 <br> 사이에 textNode가 생성되어야함
      updatedBlockList[index].children.splice(currentChildNodeIndex, 0, {
        type: 'text',
        content: '',
      });
    } else {
      // "안녕하세요"<br><br> 이 구조에서는 마지막 <br>이 textNode로 변경되어야함
      updatedBlockList[index].children.splice(currentChildNodeIndex, 1, {
        type: 'text',
        content: '',
      });
    }
  }

  // 블록에 입력된 내용을 blockList에 반영하는 로직
  updatedBlockList[index].children[currentChildNodeIndex === -1 ? startOffset : currentChildNodeIndex].content =
    currentChildNodeIndex !== -1 ? childNodes[currentChildNodeIndex].textContent || '' : '';
  // 블록 중간에 빈 textNode가 생기면 삭제하고, 마지막 줄에 빈 textNode 생기면 <br>로 변경
  if (currentChildNodeIndex === -1) {
    const updatedChildList = updatedBlockList[index].children
      .map((child, idx) => {
        if (child.type === 'text' && child.content === '') {
          if (updatedBlockList[index].children.length === 1) {
            return child;
          }
          if (idx === updatedBlockList[index].children.length - 1) {
            return {
              type: 'br' as 'br',
            };
          }
          return '';
        }
        return child;
      })
      .filter(child => child !== '');

    updatedBlockList[index].children = updatedChildList;
  }

  setBlockList(updatedBlockList);
  prevChildNodesLength.current = childNodes.length;
};

export default handleInput;
