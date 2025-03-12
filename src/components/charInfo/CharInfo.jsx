import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import './charInfo.scss';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const CharInfo = props => {
  const [char, setChar] = useState(null);

  const {process, setProcess, getCharacter, clearError} = useMarvelService();
  const {charId} = props;

  useEffect(() => {
    updateCharInfo();
  }, []);

  useEffect(() => {
    updateCharInfo();
  }, [charId]);

  const onCharLoaded = char => {
    setChar(char);
  };

  const updateCharInfo = () => {
    if (!charId) {
      return;
    }

    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed')); // вручную устанавливаем процесс подтверждено в стэйт http.hook, т.к. из-за асинхронности указать это прямо в http.hook как остальные процессы не можем, будет работать неправильно
  };

  // skeleton = если что-то из состояний есть то ничего не рендерим, если ничего нет то вставляем компонент скелетон
  // const skeleton = char || loading || error ? null : <Skeleton />;
  // const errorMessage = error ? <ErrorMessage /> : null;
  // const spinner = loading ? <Spinner /> : null;
  // const content = !(loading || error || !char) ? <View char={char} /> : null;

  return <div className="char__info">{setContent(process, View, char)}</div>;
};

const View = ({data}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = data;

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
            const comicId = `${item.resourceURI.substring(43)}`; // строка из массива данных comics

            return (
              <li
                key={i}
                className="char__comics-item">
                {/** динамическое формирование пути */}
                <Link to={`/comics/${comicId}`}>{item.name}</Link>
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
