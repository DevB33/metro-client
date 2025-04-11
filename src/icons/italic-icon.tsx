const ItalicIcon = ({ color }: { color: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="-2 -2 20 20">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M9,4 L6.5,4 C6.22385763,4 6,3.77614237 6,3.5 C6,3.22385763 6.22385763,3 6.5,3 L12.5,3 C12.7761424,3 13,3.22385763 13,3.5 C13,3.77614237 12.7761424,4 12.5,4 L10,4 L7,12 L9.5,12 C9.77614237,12 10,12.2238576 10,12.5 C10,12.7761424 9.77614237,13 9.5,13 L3.5,13 C3.22385763,13 3,12.7761424 3,12.5 C3,12.2238576 3.22385763,12 3.5,12 L6,12 L9,4 Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default ItalicIcon;
