const BulletedListIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="20 0 100 80" x="0px" y="0px">
      <g fill={color}>
        <rect x="37" y="22" width="42" height="8" />
        <rect x="37" y="38" width="42" height="8" />
        <circle cx="25" cy="42" r="4" />
        <circle cx="25" cy="26" r="4" />
        <rect x="37" y="54" width="42" height="8" />
        <circle cx="25" cy="58" r="4" />
        <rect x="37" y="70" width="42" height="8" />
        <circle cx="25" cy="74" r="4" />
      </g>
    </svg>
  );
};

export default BulletedListIcon;
