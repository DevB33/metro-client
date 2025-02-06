export interface ITextBlock {
  id: number;
  type: 'default' | 'quote' | 'ul' | 'li' | 'toggle';
  children: ITextBlockChild[];
}

interface ITextBlockChild {
  type: 'text' | 'codeBlock' | 'h1' | 'h2' | 'h3';
  style: IBlockStyle;
  content: string | null;
}

interface IBlockStyle {
  fontStyle: 'normal' | string;
  fontWeight: 'regular' | string;
  color: 'black' | string;
  backgroundColor: 'white' | string;
  width: number | string;
  height: number | string;
}
