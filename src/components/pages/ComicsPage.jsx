import {HelmetProvider, Helmet} from 'react-helmet-async';

import AppBanner from '../appBanner/AppBanner';
import ComicsList from '../comicsList/ComicsList';

const ComicsPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta
            name="description"
            content="Page with list of our comics"
          />
          <title>Comics Page</title>
        </Helmet>
        <AppBanner />
        <ComicsList />
      </HelmetProvider>
    </>
  );
};

export default ComicsPage;
