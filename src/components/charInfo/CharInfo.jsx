import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = props => {
  const [char, setChar] = useState(null);

  const {loading, error, getCharacter} = useMarvelService(); 

  useEffect(() => {
    updateCharInfo();
  }, []);

  useEffect(() => {
    updateCharInfo();
  }, [props.charId]);

  const onCharLoaded = char => {
    setChar(char);
  };

  const updateCharInfo = () => {
    if (!props.charId) {
      return;
    }

    getCharacter(props.charId)
      .then(onCharLoaded);
  };

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
};

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
