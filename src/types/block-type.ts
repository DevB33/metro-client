export type TBlockType = 'DEFAULT' | 'H1' | 'H2' | 'H3' | 'UL' | 'OL' | 'QUOTE' | 'PAGE';

export interface ITextBlock {
  id: string;
  type: TBlockType;
  nodes: ITextBlockChild[];
  order: number;
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
