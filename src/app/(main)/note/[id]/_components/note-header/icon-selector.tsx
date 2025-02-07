'use client';

import EmojiPicker from 'emoji-picker-react';

interface IIconSelectorProps {
  handleSelectIcon: (icon: string) => void;
  handleSelectorClose: () => void;
  isSelectorOpen: boolean;
}

const IconSelector = ({
  handleSelectIcon,
  handleSelectorClose,
  isSelectorOpen,
}: IIconSelectorProps) => {
  const onEmojiClick = (emojiObject: any) => {
    handleSelectIcon(emojiObject.emoji);
    handleSelectorClose();
  };

  return <EmojiPicker open={isSelectorOpen} onEmojiClick={onEmojiClick} />;
};

export default IconSelector;
