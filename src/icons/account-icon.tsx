const AccountIcon = ({ width, height }: { width: string; height: string }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.1506 10.5789C19.1506 16.0168 14.8821 20.4251 9.61657 20.4251C4.35106 20.4251 0.0825195 16.0168 0.0825195 10.5789C0.0825195 5.14106 4.35106 0.732788 9.61657 0.732788C14.8821 0.732788 19.1506 5.14106 19.1506 10.5789ZM12.0001 6.88663C12.0001 8.2461 10.9329 9.34817 9.61657 9.34817C8.30019 9.34817 7.23306 8.2461 7.23306 6.88663C7.23306 5.52716 8.30019 4.4251 9.61657 4.4251C10.9329 4.4251 12.0001 5.52716 12.0001 6.88663ZM9.61649 11.8097C7.21207 11.8097 5.14027 13.2804 4.19853 15.3983C5.50981 16.9691 7.45073 17.9636 9.61655 17.9636C11.7823 17.9636 13.7232 16.9692 15.0345 15.3984C14.0928 13.2805 12.0209 11.8097 9.61649 11.8097Z"
        fill="#111827"
      />
    </svg>
  );
};

export default AccountIcon;
