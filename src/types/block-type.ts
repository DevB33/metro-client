interface IBlockType {
  type: string;
  tag: string;
  style?: string;
  content?: string;
  children?: IBlockType[];
}

export default IBlockType;
