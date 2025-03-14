const TextIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="5 0 24 26" x="0px" y="0px">
      <path
        fill={color}
        d="M11,20V4H5V5A1,1,0,0,1,3,5V3A1,1,0,0,1,4,2H20a1,1,0,0,1,1,1V5a1,1,0,0,1-2,0V4H13V20h3a1,1,0,0,1,0,2H8a1,1,0,0,1,0-2Z"
      />
    </svg>
  );
};

export default TextIcon;
