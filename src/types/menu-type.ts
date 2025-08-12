interface IMenuState {
  isBlockMenuOpen: boolean;
  isSlashMenuOpen: boolean;
  slashMenuOpenIndex: number | null;
  isSelectionMenuOpen: boolean;
  blockButtonModalIndex: number | null;
  slashMenuPosition: { x: number; y: number };
  selectionMenuPosition: { x: number; y: number };
}

export default IMenuState;
