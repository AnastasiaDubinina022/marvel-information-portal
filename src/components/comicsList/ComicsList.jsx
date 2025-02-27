import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import './comicsList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {loading, error, getAllComics} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset).then(onComicsListLoaded);
  };

  const onComicsListLoaded = async newComicsList => {
    let ended = false;

    if (newComicsList.length < 8) {
      ended = true;
    }

    // задержка чтобы каждый перс анимировался поочередно
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let comic of newComicsList) {
      await delay(200);
      setComicsList(comicsList => [...comicsList, comic]); // функция delay будет вызывать задержку на каждой итерации цикла (добавление в стейт новых комиксов)
    }

    // setComicsList(comicsList => [...comicsList, ...newComicsList]);  // вариант бз цикла и задержки анимации
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

  const items = renderItems(comicsList);
  const spinner = loading && !newItemLoading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;

  return (
    <div className="comics__list">
      {spinner}
      {errorMessage}
      {items}
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
