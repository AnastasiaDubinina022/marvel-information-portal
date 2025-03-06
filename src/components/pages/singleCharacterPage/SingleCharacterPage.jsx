import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import './singleCharacterPage.scss';

import useMarvelService from '../../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';

const SingleCharacterPage = () => {
  const {charName} = useParams();
  const [char, setChar] = useState(null);

  const {loading, error, getCharacterByName} = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charName]);

  const updateChar = () => {
    getCharacterByName(charName).then(onCharLoaded);
  };

  const onCharLoaded = char => {
    setChar(char);
  };

  // 🔥 Защита от ошибки: ждем, пока char не загрузится (вариант, условный рендеринг тоже решает проблему ошибки при обновлении страицы)
  // if (!char) {
  //     return <p>Loading...</p>; // Можно заменить на спиннер
  // }

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = char ? <View char={char} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({char}) => {
  const {thumbnail, name, description} = char;
  const navigate = useNavigate();

  return (
    <div className="single-comic">
      <img
        src={thumbnail}
        alt={name}
        className="single-comic__img"
      />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
      <button
        className="single-comic__back"
        // onClick={handleGoBack}
        onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default SingleCharacterPage;
