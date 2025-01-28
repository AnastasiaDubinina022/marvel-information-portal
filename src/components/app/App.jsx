import {useState} from 'react';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ComicsList from '../comicsList/ComicsList';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const App = () => {
  const [selectedChar, setChar] = useState(null);
  const [page, setPage] = useState('characters');

  const onCharSelected = id => {
    setChar(id);
  };

  const onPageSelected = (page) => {
    setPage(page);
  }

  return (
    <div className="app">
      <AppHeader onPageSelected={onPageSelected}/>
      <main>
        {page === 'characters' && 
          <>
          <ErrorBoundary>
          <RandomChar />
        </ErrorBoundary>
        <div className="char__content">
          <ErrorBoundary>
            <CharList onCharSelected={onCharSelected} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CharInfo charId={selectedChar} />{' '}
          </ErrorBoundary>
        </div>
        <img
          className="bg-decoration"
          src={decoration}
          alt="vision"
        /></>
        }
        
        {page === 'comics' && 
          <>
          <ErrorBoundary>
          <ComicsList />
          </ErrorBoundary>
          </>
        }
        
      </main>
    </div>
  );
};

export default App;
