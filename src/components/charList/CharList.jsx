import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import './charList.scss';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = props => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(null);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService(); // объект, который конструируетсфя при помощи класса MarvelService

  useEffect(() => {
    onRequest();
  }, []); // 1 раз когда компонент был смонтирован вызываем onRequest (аналог componentDidMount)

  const onRequest = offset => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset) // здесь если не передать аргуемент подставится null и метод возьмет оффсет по умолчанию в getAllCharacters
      .then(onCharListLoaded) // сюда приходит ответ с сервера с 9ю персонажами и подставляется аргументом в onCharListLoaded
      .catch(onError);
  };

  // доп. метод, которы говорит о том что запустился запрос и что-то там грузится
  const onCharListLoading = () => {
    setNewItemLoading(true);
  };

  // здесь аргумент ответ сервера с 9* новыми загруженными персонажами
  const onCharListLoaded = newCharList => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charList => [...charList, ...newCharList]); // соединяем старый массив с персонажами с новым и пилим в стэйт
    setLoading(false);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const itemRefs = useRef([]); // создаем массив с рефами, он будет лежать в itemRefs.current

  // эта функция сработает нормально в классах, а в функц. комп. push с рефами может дать ошибку. см. нужную функцию в назначении рефов
  // setRef = ref => {
  //   this.itemRefs.push(ref);
  // };

  const focusOnItem = id => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  };

  // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = 'char__item';
      if (
        item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ) {
        imgStyle += ' object-fit-fill';
      }

      return (
        <li
          className={imgStyle}
          key={item.id}
          tabIndex={0}
          ref={elem => (itemRefs.current[i] = elem)} // последовательно формируем массив с рефами, elem - ссылка на элемент в DOM
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
      );
    });

    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className="char__grid">{items}</ul>;
  }

  const items = renderItems(charList);

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading} //  если newItemLoading true кпонка блокируется
        style={{display: charEnded ? 'none' : 'block'}} // если персонажи закончились скрываем кнопку
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

// Этот синтаксис будет нормально работать в функц.комп. при условии что ниже export default ( а не export const CharList = (props) => {...} )
CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
