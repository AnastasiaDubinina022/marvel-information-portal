import {useNavigate} from 'react-router-dom';

import './singleComicLayout.scss';

const SingleComicLayout = ({data}) => {
  const {title, description, price, pageCount, thumbnail, language} = data;
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

export default SingleComicLayout;
