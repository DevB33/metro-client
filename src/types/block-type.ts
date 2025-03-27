export default interface ITextBlock {
  id: number;
  type: 'default' | 'h1' | 'h2' | 'h3' | 'quote' | 'ol' | 'ul';
  children: ITextBlockChild[];
}

interface ITextBlockChild {
  type: 'text' | 'span' | 'br';
  style?: IBlockStyle;
  content?: string;
}

interface IBlockStyle {
  fontStyle: 'normal' | string;
  fontWeight: 'regular' | 'bold' | string;
  color: 'black' | string;
  backgroundColor: 'white' | string;
  width: number | string;
  height: number | string;
}
