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
      .then(() => setProcess('confirmed')); 
  };

  return <div className="char__info">{setContent(process, View, char)}</div>;
};

const View = ({data}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = data;

  let imgStyle = {objectFit: 'cover'};
  if (thumbnail === 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 
    thumbnail === 'https://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
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
            const comicId = `${item.resourceURI.substring(43)}`; 

            return (
              <li
                key={i}
                className="char__comics-item">
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
  charId: PropTypes.number, 

 
};

export default CharInfo;
