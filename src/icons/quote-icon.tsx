const QuoteIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="20 0 100 80">
      <g>
        <path
          d="M74,46H62A12,12,0,0,1,74,34h4V26H74A20,20,0,0,0,54,46V66a8,8,0,0,0,8,8H74a8,8,0,0,0,8-8V54A8,8,0,0,0,74,46Zm0,20H62V54H74Z"
          fill={color}
        />
        <path
          d="M38,46H26A12,12,0,0,1,38,34h4V26H38A20,20,0,0,0,18,46V66a8,8,0,0,0,8,8H38a8,8,0,0,0,8-8V54A8,8,0,0,0,38,46Zm0,20H26V54H38Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default QuoteIcon;
