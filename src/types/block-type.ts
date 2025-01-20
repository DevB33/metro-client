interface IBlockType {
  type: string;
  tag: string;
  style: string;
  children: IBlockType[];
}

export default IBlockType;
