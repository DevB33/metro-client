import ISelectionPosition from '@/types/selection-position';
import fillHTMLElementBackgroundImage from '@/utils/fillHTMLElementBackgroundImage';

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

const handleMouseLeave = (
  index: number,
  isDragging: boolean,
  isUp: boolean,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
) => {
  if (!isDragging) return;
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

  // 시작 블록에서 떠날 때
  if (index === selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex) {
    let left = 99999;
    let right = 0;
    // 아래로 떠날 때
    if (!isUp) {
      childNodes.forEach((childNode, idx) => {
        // 시작 노드보다 뒤에 있는 노드일 때
        if (idx > selectionStartPosition.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 시작 노드일 때
        if (idx === selectionStartPosition.childNodeIndex) {
          const rect = getNodeBounds(
            childNode as Node,
            selectionStartPosition.offset,
            childNode.textContent?.length as number,
          );
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
    }

    // 위로 떠날 때
    if (isUp) {
      childNodes.forEach((childNode, idx) => {
        // 시작 노드보다 앞에 있는 노드일 때
        if (idx < selectionStartPosition.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 시작 노드일 때
        if (idx === selectionStartPosition.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, selectionStartPosition.offset);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
    }

    const blockElement = blockRef.current[index];
    const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
    if (!blockElement) return;
    fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
  }

  // 아래로 드래그한 상태에서 블록을 떠날 때
  if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
    let left = 99999;
    let right = 0;

    // 위로 드래그 할 때
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }

    // 아래로 드래그 할 때
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }
  }

  // 위로 드래그한 상태에서 블록을 떠날 때
  if (selectionStartPosition.blockIndex > selectionEndPosition.blockIndex) {
    let left = 99999;
    let right = 0;
    // 아래로 드래그 할 때
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }

    // 위로 드래그 할 때
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
    }
  }
};

export default handleMouseLeave;
