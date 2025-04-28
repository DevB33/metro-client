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
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  isDragging: boolean,
  isUp: boolean,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selection: ISelectionPosition,
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
) => {
  if (!isDragging) return;
  const windowSelection = window.getSelection();
  if (windowSelection) windowSelection.removeAllRanges();

  const fakeBox = document.getElementById('fakeBox');

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textLength = parent?.textContent?.length || 0;

  // 시작 블록에서 떠날 때
  if (index === selection.start.blockIndex && index === selection.end.blockIndex) {
    let left = 99999;
    let right = 0;

    // fakeBox로 떠날 때, position 변화 x
    if (event.relatedTarget instanceof HTMLElement && fakeBox?.contains(event.relatedTarget)) {
      return;
    }

    // 아래로 떠날 때
    if (!isUp) {
      childNodes.forEach((childNode, idx) => {
        // 시작 노드보다 뒤에 있는 노드일 때
        if (idx > selection.start.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 시작 노드일 때
        if (idx === selection.start.childNodeIndex) {
          const rect = getNodeBounds(
            childNode as Node,
            selection.start.offset,
            childNode.textContent?.length as number,
          );
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
        if (idx === childNodes.length - 1) {
          setSelection(prev => ({
            ...prev,
            end: { ...prev.end, childNodeIndex: idx, offset: childNode.textContent?.length || 0 },
          }));
        }
      });
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, offset: textLength },
      }));
    }

    // 위로 떠날 때
    if (isUp) {
      childNodes.forEach((childNode, idx) => {
        // 시작 노드보다 앞에 있는 노드일 때
        if (idx < selection.start.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }

        // 시작 노드일 때
        if (idx === selection.start.childNodeIndex) {
          const rect = getNodeBounds(childNode as Node, 0, selection.start.offset);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
        }
      });
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, childNodeIndex: 0, offset: 0 },
      }));
    }

    const blockElement = blockRef.current[index];
    const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
    if (!blockElement) return;
    fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
  }

  // 아래로 드래그한 상태에서 블록을 떠날 때
  if (selection.start.blockIndex < selection.end.blockIndex) {
    let left = 99999;
    let right = 0;

    // 위로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && isUp) {
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }

    // 아래로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && !isUp) {
      childNodes.forEach((childNode, idx) => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        if (idx === childNodes.length - 1) {
          setSelection(prev => ({
            ...prev,
            end: { ...prev.end, childNodeIndex: idx, offset: childNode.textContent?.length || 0 },
          }));
        }
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, offset: textLength },
      }));
    }
  }

  // 위로 드래그한 상태에서 블록을 떠날 때
  if (selection.start.blockIndex > selection.end.blockIndex) {
    let left = 99999;
    let right = 0;
    // 아래로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && !isUp) {
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }

    // 위로 드래그 할 때
    if (index !== selection.start.blockIndex && index === selection.end.blockIndex && isUp) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });
      const blockElement = blockRef.current[index];
      const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
      if (!blockElement) return;
      fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      setSelection(prev => ({
        ...prev,
        end: { ...prev.end, childNodeIndex: 0, offset: 0 },
      }));
    }
  }
};

export default handleMouseLeave;
