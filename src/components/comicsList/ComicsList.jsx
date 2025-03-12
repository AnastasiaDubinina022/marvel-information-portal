import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import './comicsList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, newItemLoading) => {
  // логика этого компонента отличается от других, поэтому здесь отдельная функция представления контента а не импортированная из utils

  switch (process) {
    case 'waiting':
      return <Spinner />;
    // break;  // если в case есть return то break не обязателен, код дальше по кейсам не пойдет
    case 'loading':
      return newItemLoading ? <Component /> : <Spinner />; // если процесс и это дозагрузка персонажей то рендерим просто компонент, если это не дозагрузка новых персонажей то спиннер
    case 'confirmed':
      return <Component />;
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {process, setProcess, getAllComics} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsListLoaded)
      .then(() => setProcess('confirmed'));
  };

  const onComicsListLoaded = async newComicsList => {
    let ended = false;

    if (newComicsList.length < 8) {
      ended = true;
    }

    setComicsList(comicsList => [...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset => offset + 8);
    setComicsEnded(ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <CSSTransition
          timeout={500}
          classNames="comics__item"
          key={item.id}>
          <li
            className="comics__item"
            key={i}>
            {/** динамическое формирование пути */}
            <Link to={`/comics/${item.id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="comics__item-img"
              />
              <div className="comics__item-name">{item.title}</div>
              <div className="comics__item-price">{item.price}</div>
            </Link>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  // const items = renderItems(comicsList);
  // const spinner = loading && !newItemLoading ? <Spinner /> : null;
  // const errorMessage = error ? <ErrorMessage /> : null;

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comicsList), newItemLoading)}
      <button
        className="button button__main button__long"
        disabled={newItemLoading} //  если newItemLoading true кнопка блокируется
        style={{display: comicsEnded ? 'none' : 'block'}} // если комиксы закончились скрываем кнопку
        onClick={() => onRequest(offset)} // колбэк обязателен, иначе бесконечный цикл запросов руинит приложение (запросы отправляются до того как компонент смонтирован)
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
