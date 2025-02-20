const getSelectionInfo = (rangeIndex: number) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(rangeIndex);
  const { startOffset, endOffset, startContainer, endContainer } = selection.getRangeAt(rangeIndex);

  return { range, startOffset, endOffset, startContainer, endContainer };
};

export default getSelectionInfo;
