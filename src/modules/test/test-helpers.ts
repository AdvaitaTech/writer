export const createTextSelection = (
  field: HTMLElement,
  startPos: number,
  endPos: number,
  fromNodeIndex = 0,
  toNodeIndex = 0
) => {
  const sel = window.getSelection();
  const range = window.document.createRange();
  const fromChild = field.children[fromNodeIndex]?.firstChild;
  const toChild = field.children[toNodeIndex]?.firstChild;
  if (!sel || !field || !toChild || !fromChild) {
    throw new Error("No field found");
  }
  range.setStart(fromChild, startPos);
  range.setEnd(toChild, endPos);
  sel.removeAllRanges();
  sel.addRange(range);
  field.focus();
};

export const createNodeSelection = (field: HTMLElement) => {
  const sel = window.getSelection();
  const range = window.document.createRange();
  if (!sel || !field) {
    throw new Error("No field found");
  }
  range.selectNodeContents(field);
  sel.removeAllRanges();
  sel.addRange(range);
  field.focus();
};
