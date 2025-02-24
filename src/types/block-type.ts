export interface ITextBlock {
  id: number;
  type: 'default' | 'quote' | 'ul' | 'li' | 'toggle';
  children: ITextBlockChild[];
}

interface ITextBlockChild {
  type: 'text' | 'span' | 'br';
  style?: IBlockStyle;
  content?: string;
}

interface IBlockStyle {
  fontStyle: 'normal' | string;
  fontWeight: 'regular' | string;
  color: 'black' | string;
  backgroundColor: 'white' | string;
  width: number | string;
  height: number | string;
}
