import {useState, useEffect, useRef, useMemo} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import PropTypes from 'prop-types';

import './charList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, newItemLoading) => {

  switch (process) {
    case 'waiting':
      return <Spinner />;
    case 'loading':
      return newItemLoading ? <Component /> : <Spinner />; 
    case 'confirmed':
      return <Component />;
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};

const CharList = props => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const {process, setProcess, getAllCharacters} = useMarvelService(); 

  useEffect(() => {
    onRequest(offset, true);
  }, []);

 
  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded) 
      .then(() => setProcess('confirmed'));  
  };

  
  const onCharListLoaded = async newCharList => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charList => [...charList, ...newCharList]); 
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  };

  const itemRefs = useRef([]); 

  const focusOnItem = id => {
    itemRefs.current.forEach(item => {
      if (item) item.classList.remove('char__item_selected');
    }); 

    if (itemRefs.current[id]) {
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
    } 
  };

  
  function renderItems(arr) {
    itemRefs.current = []; 

    const items = arr.map((item, i) => {
      let imgStyle = 'char__item';
      if (
        item.thumbnail === 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 
        item.thumbnail === 'https://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif'
      ) {
        imgStyle += ' object-fit-fill';
      }

      return (
        <CSSTransition
          timeout={500}
          classNames="char__item"
          key={item.id}>
          <li
            className={imgStyle}
            key={item.id}
            tabIndex={0}
            ref={elem => (itemRefs.current[i] = elem)} 
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}>
            <img
              src={item.thumbnail}
              alt={item.name}
            />
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      );
    });

    // конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(charList), newItemLoading);
    // eslint-disable-next-line
  }, [process]);

  return (
    <div className="char__list">
      {elements}
      <button
        className="button button__main button__long"
        disabled={newItemLoading} 
        style={{display: charEnded ? 'none' : 'block'}} 
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  );
};


CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
