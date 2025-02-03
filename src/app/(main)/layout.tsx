import { css } from '@/../styled-system/css';

import Sidebar from './_components/sidebar/sidebar';

const RootLayout = async ({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) => {
  return (
    <div className={css({ display: 'flex', flexDirection: 'row' })}>
      <Sidebar />
      {children}
      {modal}
    </div>
  );
};

export default RootLayout;
