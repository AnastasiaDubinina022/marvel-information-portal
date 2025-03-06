import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import './singleComicPage.scss';

import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';

const SingleComicPage = () => {
  const {comicId} = useParams(); // вытаскиваем comicId из params {comicId: '77343'}
  const [comic, setComic] = useState(null);

  const {loading, error, getComic} = useMarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    // clearError();
    getComic(comicId).then(onComicLoaded);
  };

  const onComicLoaded = comic => {
    setComic(comic);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({comic}) => {
  const {title, description, price, pageCount, thumbnail, language} = comic;
  const navigate = useNavigate();

  // эта проверка не работает на локалхост
  // const siteOrigin = window.location.origin;  // домен текущего сайта

  // const handleGoBack = () => {
  //   if (document.referrer.startsWith(siteOrigin)) {  // Возвращаем назад только если реферер с нашего сайта
  //     navigate(-1);
  //   } else {            // Иначе ведём на главную
  //     navigate('/');
  //   }
  // }

  return (
    <div className="single-comic">
      <img
        src={thumbnail}
        alt={title}
        className="single-comic__img"
      />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{pageCount}</p>
        <p className="single-comic__descr">{language}</p>
        <div className="single-comic__price">{price}</div>
      </div>
      <button
        className="single-comic__back"
        // onClick={handleGoBack}
        onClick={() => navigate(-1)}>
        Back to all
      </button>
    </div>
  );
};

export default SingleComicPage;
