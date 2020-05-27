import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';

interface PageProps {
  title: string;
  children: React.ReactNode;
  className: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ title, children, ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        <Helmet>
          <title>{`${title} | Beauty in Blooms`}</title>
        </Helmet>
        {children}
      </div>
    );
  }
);

export default Page;
