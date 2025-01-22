interface IBlockType {
  type: string;
  tag: string;
  style: string | null;
  content: string | null;
  children: IBlockType[] | null;
}

export default IBlockType;
