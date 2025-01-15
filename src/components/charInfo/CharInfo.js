import {Component} from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componenDidMount() {
    this.updateCharInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      // эта проверка помогает избежать попадания в бесконечный цикл, а так же если пользователь начнет кликать по одному и тому же персонажу не будет происходить перерендер
      this.updateCharInfo();
    }
  }

  onCharLoaded = char => {
    this.setState({
      char,
      loading: false,
    });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
      error: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateCharInfo = () => {
    const {charId} = this.props;

    if (!charId) {
      return;
    }

    this.onCharLoading(); // здесь изначально нет загрузки т.к. стоит заглушка до нажатия на персонажа списка, при обновлении вызываем загрузку
    this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);

    // this.foo.bar = 0;
  };

  render() {
    const {char, loading, error} = this.state;

    // skeleton = если что-то из состояний есть то ничего не рендерим, если ничего нет то вставляем компонент скелетон
    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = char;

  let imgStyle = {objectFit: 'cover'};
  if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = {objectFit: 'fill'};
  }

  return (
    <>
      <div className="char__basics">
        <img
          style={imgStyle}
          src={thumbnail}
          alt={name}
        />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a
              href={homepage}
              className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a
              href={wiki}
              className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length === 0 && (
          <li className="char__comics-item">There is no comics with this character.</li>
        )}
        {comics
          .map((item, i) => {
            return (
              <li
                key={i}
                className="char__comics-item">
                {item.name}
              </li>
            );
          })
          .slice(0, 10)}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number, // пропс charId должен соответствовать типу number

  // charId: PropTypes.string  // получаем в консоль предупреждение Warning: Failed prop type: Invalid prop `charId` of type `number` supplied to `CharInfo`, expected `string`.
};

export default CharInfo;
