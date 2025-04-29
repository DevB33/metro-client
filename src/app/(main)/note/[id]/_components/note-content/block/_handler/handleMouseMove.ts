import ISelectionPosition from '@/types/selection-position';
import fillHTMLElementBackgroundImage from '@/utils/fillHTMLElementBackgroundImage';
import getSelectionInfo from '@/utils/getSelectionInfo';

const getNodeBounds = (node: Node, startOffset: number, endOffset: number) => {
  const range = document.createRange();
  let targetNode = node;
  // span 같은 element면 그 안에 있는 텍스트 노드로 변경
  if (node.nodeType !== Node.TEXT_NODE) {
    const firstTextNode = node.childNodes[0];
    if (!firstTextNode || firstTextNode.nodeType !== Node.TEXT_NODE) {
      return new DOMRect();
    }
    targetNode = firstTextNode;
  }

  range.setStart(targetNode as Node, startOffset);
  range.setEnd(targetNode as Node, endOffset);
  return range.getBoundingClientRect();
};

const handleMouseMove = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  isDragging: boolean,
  selection: ISelectionPosition,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
  setIsUp: React.Dispatch<React.SetStateAction<boolean>>,
  prevClientY: React.RefObject<number>,
) => {
  if (!isDragging) return;

  if (index !== selection.end.blockIndex) {
    setSelection(prev => ({
      ...prev,
      end: { ...prev.end, blockIndex: index },
    }));
  }

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  if (currentChildNodeIndex === -1) return;

  if (currentChildNodeIndex !== selection.end.childNodeIndex) {
    setSelection(prev => ({
      ...prev,
      end: { ...prev.end, childNodeIndex: currentChildNodeIndex },
    }));
  }

  const { startOffset } = getSelectionInfo(0) || {};
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  // 셀렉션이 만들어 질 때 기본 셀렉션 지우기
  if (startOffset !== undefined && charIdx !== startOffset) {
    const windowSelection = window.getSelection();
    if (windowSelection) windowSelection.removeAllRanges();
  }
  setSelection(prev => ({
    ...prev,
    end: { ...prev.end, offset: charIdx },
  }));

  // 첫 번째 블록에서
  if (index === selection.start.blockIndex && index === selection.end.blockIndex) {
    // 한 노드 내에서 드래그
    if (currentChildNodeIndex === selection.start.childNodeIndex) {
      const rect =
        charIdx > selection.start.offset
          ? getNodeBounds(childNodes[currentChildNodeIndex] as Node, selection.start.offset, charIdx)
          : getNodeBounds(childNodes[currentChildNodeIndex] as Node, charIdx, selection.start.offset);

      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(
        blockElement,
        rect.left - blockElementMarginLeft,
        rect.right - blockElementMarginLeft,
      );
    }

    // 왼쪽으로 드래그
    if (currentChildNodeIndex < selection.start.childNodeIndex) {
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        // 드래그를 시작한 노드일 때
        if (selection.start.childNodeIndex === idx) {
          const rect = getNodeBounds(childNode as Node, 0, selection.start.offset);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 끝낸 노드일 때
        if (currentChildNodeIndex === idx) {
          const rect = getNodeBounds(childNode as Node, charIdx, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 시작한 노드와 끝낸 노드 사이의 노드일 때
        if (currentChildNodeIndex < idx && selection.start.childNodeIndex > idx) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }
    // 오른쪽으로 드래그
    if (currentChildNodeIndex > selection.start.childNodeIndex) {
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        // 드래그를 시작한 노드일 때
        if (selection.start.childNodeIndex === idx) {
          const rect = getNodeBounds(
            childNode as Node,
            selection.start.offset,
            childNode.textContent?.length as number,
          );
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 끝낸 노드일 때
        if (currentChildNodeIndex === idx) {
          const rect = getNodeBounds(childNode as Node, 0, charIdx);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 시작한 노드와 끝낸 노드 사이의 노드일 때
        if (currentChildNodeIndex < idx && selection.start.childNodeIndex > idx) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }
  }

  // 마지막 블록에서
  if (index !== selection.start.blockIndex && index === selection.end.blockIndex) {
    if (selection.start.blockIndex < selection.end.blockIndex) {
      // 아래로 드래그 된 상태일 때
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        // 드래그를 끝낸 노드일 때
        if (currentChildNodeIndex === idx) {
          const rect = getNodeBounds(childNode as Node, 0, charIdx);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 끝낸 노드보다 전에 있는 노드일 때
        if (currentChildNodeIndex > idx) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }

    // 위로 드래그 된 상태일 때
    if (selection.start.blockIndex > selection.end.blockIndex) {
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        // 드래그를 끝낸 노드일 때
        if (currentChildNodeIndex === idx) {
          const rect = getNodeBounds(childNode as Node, charIdx, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 드래그를 끝낸 노드보다 후에 있는 노드일 때
        if (currentChildNodeIndex < idx) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }
  }

  if (prevClientY.current < event.clientY) {
    setIsUp(false);
    prevClientY.current = event.clientY;
  } else if (prevClientY.current > event.clientY) {
    setIsUp(true);
    prevClientY.current = event.clientY;
  }
};

export default handleMouseMove;
