import {useState, useEffect, useRef, useMemo} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import PropTypes from 'prop-types';

import './charList.scss';

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

const CharList = props => {
  const [charList, setCharList] = useState([]);
  // const [loading, setLoading] = useState(true);  // эти состояния теперь контролируются из useHttp
  // const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const {process, setProcess, getAllCharacters} = useMarvelService(); // вытаскиваем сущности из объекта вызова useMarvelService

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  // добавлен второй аргумент initial - для определения первичной загрузки (чтобы далее решить проблему разницы в логике загрузки здесь и в useHttp и пропаданием всех персонажей при дозагрузке новых)
  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset) // здесь если не передать аргуемент подставится null и метод возьмет оффсет по умолчанию в getAllCharacters
      .then(onCharListLoaded) // сюда приходит ответ с сервера с 9ю персонажами и подставляется аргументом в onCharListLoaded
      .then(() => setProcess('confirmed'));
    // .catch(onError);     // ошибки теперь обрабатываются в useHttp
  };

  // здесь аргумент ответ сервера с 9* новыми загруженными персонажами
  const onCharListLoaded = async newCharList => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charList => [...charList, ...newCharList]); // соединяем старый массив с персонажами с новым и пилим в стэйт
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  };

  const itemRefs = useRef([]); // создаем массив с рефами, он будет лежать в itemRefs.current

  // эта функция сработает нормально в классах, а в функц. комп. push с рефами может дать ошибку. см. нужную функцию в назначении рефов
  // setRef = ref => {
  //   this.itemRefs.push(ref);
  // };

  const focusOnItem = id => {
    itemRefs.current.forEach(item => {
      if (item) item.classList.remove('char__item_selected');
    }); // проверка что элеменнт существует т.к. рефы

    if (itemRefs.current[id]) {
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
    } // Теперь c проверками код не сломается, даже если itemRefs.current содержит null-значения.
  };

  // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
  function renderItems(arr) {
    itemRefs.current = []; // Очищаем массив перед каждым ререндером, так он будт содержать только актуальные значения

    const items = arr.map((item, i) => {
      let imgStyle = 'char__item';
      if (
        item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
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
        </CSSTransition>
      );
    });

    // А эта конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  // const spinner = loading && !newItemLoading ? <Spinner /> : null; // если идет первая загрузка, но не дозагрузка новых чаровб то показ. спиннер
  // const errorMessage = error ? <ErrorMessage /> : null;
  // const content = !(loading || error) ? items : null;  // в отличие от классов здесь это условие не нужно, т.к. при каждом перерендере все переменные пересоздаются и с этой строкой все персы пропадают в момент дозагрузки  тк на какой-то момент сюда помещается null

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(charList), newItemLoading);
    // eslint-disable-next-line
  }, [process]);

  return (
    <div className="char__list">
      {elements}
      <button
        className="button button__main button__long"
        disabled={newItemLoading} //  если newItemLoading true кнопка блокируется
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
