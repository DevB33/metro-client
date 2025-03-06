const NumberedListIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="18" viewBox="20 0 100 80" x="0px" y="0px">
      <g fill={color}>
        <path d="M25,46h8V25a4,4,0,0,0-4-4H19v8h6Z" />
        <rect x="42" y="22" width="39" height="8" />
        <rect x="42" y="38" width="39" height="8" />
        <rect x="42" y="54" width="39" height="8" />
        <rect x="42" y="70" width="39" height="8" />
        <path d="M29.36,69.29l3.43-3.43A7.54,7.54,0,0,0,27.46,53H19v8h7.34l-2.64,2.64A16,16,0,0,0,19,75a4,4,0,0,0,4,4H36V71H28.06A8.12,8.12,0,0,1,29.36,69.29Z" />
      </g>
    </svg>
  );
};

export default NumberedListIcon;
