import {Link} from 'react-router-dom';
import {HelmetProvider, Helmet} from 'react-helmet-async';

import ErrorMessage from '../errorMessage/ErrorMessage';

const Page404 = () => {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <meta
            name="description"
            content="This page is not found"
          />
          <title>Page not found</title>
        </Helmet>
        <ErrorMessage />
        <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '24px'}}>
          Page doesn't exist
        </p>
        <Link
          style={{
            display: 'block',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '24px',
            marginTop: '30px',
          }}
          to="/">
          Back to main page
        </Link>
      </div>
    </HelmetProvider>
  );
};

export default Page404;
