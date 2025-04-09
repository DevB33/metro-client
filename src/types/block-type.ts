export interface ITextBlock {
  id: number;
  type: 'default' | 'h1' | 'h2' | 'h3' | 'quote' | 'ol' | 'ul';
  children: ITextBlockChild[];
}

export interface ITextBlockChild {
  type: 'text' | 'span' | 'br';
  style?: IBlockStyle;
  content?: string;
}

export interface IBlockStyle {
  fontStyle: 'normal' | 'italic' | string;
  fontWeight: 'regular' | 'bold' | string;
  textDecoration: 'none' | 'underline' | 'line-through' | string;
  color: 'black' | string;
  backgroundColor: 'white' | 'grey' | string;
  width: number | string;
  height: number | string;
  borderRadius: number | string;
}
