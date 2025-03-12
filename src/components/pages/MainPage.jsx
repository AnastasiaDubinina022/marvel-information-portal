import {useState, useCallback} from 'react';
import {HelmetProvider, Helmet} from 'react-helmet-async';

import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import CharSearchForm from '../charSearchForm/charSearchForm';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
  const [selectedChar, setChar] = useState(null);

  const onCharSelected = useCallback(id => {
    setChar(id);
  }, []); // Теперь функция onCharSelected не будет пересоздаваться при каждом ререндере MainPage, а CharList не будет перерендериваться без необходимости.

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta
            name="description"
            content="Marvel information portal"
          />
          <title>Marvel information portal</title>
        </Helmet>
        <ErrorBoundary>
          <RandomChar />
        </ErrorBoundary>
        <div className="char__content">
          <ErrorBoundary>
            <CharList onCharSelected={onCharSelected} />
          </ErrorBoundary>
          <div className="char__content-side-column">
            <ErrorBoundary>
              <CharInfo charId={selectedChar} />{' '}
            </ErrorBoundary>
            <ErrorBoundary>
              <CharSearchForm />
            </ErrorBoundary>
          </div>
        </div>
        <img
          className="bg-decoration"
          src={decoration}
          alt="vision"
        />
      </HelmetProvider>
    </>
  );
};

export default MainPage;
