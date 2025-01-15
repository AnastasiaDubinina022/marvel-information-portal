import {Component} from 'react';
import PropTypes from 'prop-types';

import './charList.scss';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: null,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    // const charListLocalState = localStorage.getItem('charList:state');

    // if (!charListLocalState) {
    //   localStorage.setItem('charList:state', JSON.stringify({
    //     offset: 210
    //   }))
    // }

    // if (charListLocalState) {
    //   const charListState = JSON.parse(charListLocalState);
    //   this.setState({
    //     offset: charListState.offset
    //   })
    // }

    this.onRequest(); // при первом вызове формируется компонент и onRequest вызываем без передачи аргумента оффсета
    // window.addEventListener('scroll', this.onLoadByScroll);
  }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onLoadByScroll);
  // }

  // onLoadByScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //     document.documentElement.offsetHeight - 150
  //   ) {
  //     this.onRequest(this.state.offset);
  //   }
  // };

  onRequest = offset => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset) // здесь если не передать аргуемент подставится null и метод возьмет оффсет по умолчанию в getAllCharacters
      .then(this.onCharListLoaded) // сюда приходит ответ с сервера с 9ю персонажами и подставляется аргументом в onCharListLoaded
      .catch(this.onError);
  };

  // доп. метод, которы говорит о том что запустился запрос и что-то там грузится
  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = newCharList => {
    // здесь аргуемнтом ответ сервера с 9* новыми загруженными персонажами
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({charList, offset}) => ({
      // здесь достаем текущий стэйт
      charList: [...charList, ...newCharList], // соединяем старый массив с персонажами с новым и пилим в стэйт
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  itemRefs = [];

  setRef = ref => {
    this.itemRefs.push(ref);
  };

  focusOnItem = id => {
    this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  };

  // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render
  renderItems = arr => {
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
          ref={this.setRef}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.focusOnItem(i);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.props.onCharSelected(item.id);
              this.focusOnItem(i);
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

    // А эта конструкция вынесена для центровки спиннера/ошибки (?)
    return <ul className="char__grid">{items}</ul>;
  };

  render() {
    const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

    const items = this.renderItems(charList);

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
          onClick={() => this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
