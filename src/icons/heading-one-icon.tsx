const HeadingOneIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 30 20" fill="none">
      <path
        d="M12,6V18a1,1,0,0,1-2,0V13H4v5a1,1,0,0,1-2,0V6A1,1,0,0,1,4,6v5h6V6a1,1,0,0,1,2,0Zm5,11a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2H20V6a1,1,0,0,0-1-1H17a1,1,0,0,0,0,2h1V17Z"
        fill={color}
      />
    </svg>
  );
};

export default HeadingOneIcon;
