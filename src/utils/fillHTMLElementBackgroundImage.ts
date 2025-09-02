const fillHTMLElementBackgroundImage = (
  element: HTMLElement,
  startNode: Node,
  startOffset: number,
  endNode: Node,
  endOffset: number,
) => {
  if (!startNode || !endNode) return;

  const startTextNode = startNode.nodeType === Node.ELEMENT_NODE ? startNode.firstChild : startNode;
  const endTextNode = endNode.nodeType === Node.ELEMENT_NODE ? endNode.firstChild : endNode;

  const range = document.createRange();
  range.setStart(startTextNode as Node, startOffset);
  range.setEnd(endTextNode as Node, endOffset);

  const base = element.getBoundingClientRect();
  const rects = Array.from(range.getClientRects());

  const images = rects.map(() => `linear-gradient(lightblue, lightblue)`).join(', ');
  const positions = rects
    .map(r => `${r.left - base.left + (element.scrollLeft || 0)}px ${r.top - base.top + (element.scrollTop || 0)}px`)
    .join(', ');
  const sizes = rects.map(r => `${r.width}px ${r.height}px`).join(', ');

  element.style.backgroundImage = images;
  element.style.backgroundRepeat = 'no-repeat, '.repeat(rects.length).slice(0, -2);
  element.style.backgroundPosition = positions;
  element.style.backgroundSize = sizes;
};

export default fillHTMLElementBackgroundImage;
