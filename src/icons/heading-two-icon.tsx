const HeadingTwoIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 30 20" x="0px" y="0px">
      <path
        d="M1,18V6A1,1,0,0,1,3,6v5H9V6a1,1,0,0,1,2,0V18a1,1,0,0,1-2,0V13H3v5a1,1,0,0,1-2,0Zm22-8a5,5,0,0,0-10,0,1,1,0,0,0,2,0,3,3,0,1,1,4.8008,2.4l-6.4,4.8A1,1,0,0,0,14,19h8a1,1,0,0,0,0-2H17l4.001-3A5.0259,5.0259,0,0,0,23,10Z"
        fill={color}
      />
    </svg>
  );
};

export default HeadingTwoIcon;
