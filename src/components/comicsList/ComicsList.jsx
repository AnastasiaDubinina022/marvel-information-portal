import { useState, useEffect } from 'react';

import './comicsList.scss';

import useMarvelService from '../../services/MarvelService';

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
  getAllComics(offset)
  .then(onComicsListLoaded);
}

const onComicsListLoaded = (newComicsList) => {
  setComicsList(comicsList => [...comicsList, ...newComicsList]);
  setNewItemLoading(false);
}

  function renderItems(arr) {
    const items = arr.map(item => {

      return (
        <li className="comics__item"
            key={item.id}>
          <a href={item.url}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </a>
        </li>
      )
    })

    return items;
  }

  const items = renderItems(comicsList);
  
  return (
    <div className="comics__list">
      <ul className="comics__grid">
        {items}
      </ul>
      <button className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
