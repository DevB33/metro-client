import { IBlockStyle } from '@/types/block-type';

const createNewStyle = (type: string, beforeStyle: IBlockStyle) => {
  if (type === 'bold') {
    return {
      fontWeight: beforeStyle.fontWeight === 'bold' ? 'normal' : 'bold',
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'italic') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle === 'italic' ? 'normal' : 'italic',
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'underline') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration === 'underline' ? 'none' : 'underline',
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'line-through') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration === 'line-through' ? 'none' : 'line-through',
      color: beforeStyle.color,
      backgroundColor: beforeStyle.backgroundColor,
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
  if (type === 'codeblock') {
    return {
      fontWeight: beforeStyle.fontWeight,
      fontStyle: beforeStyle.fontStyle,
      textDecoration: beforeStyle.textDecoration,
      color: beforeStyle.color === 'red' ? 'black' : 'red',
      backgroundColor:
        beforeStyle.backgroundColor === 'rgba(161, 161, 161, 0.5)' ? 'transparent' : 'rgba(161, 161, 161, 0.5)',
      width: beforeStyle.width,
      height: beforeStyle.height,
      borderRadius: beforeStyle.borderRadius,
    };
  }
};

export default createNewStyle;
