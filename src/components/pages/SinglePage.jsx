import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../../components/appBanner/AppBanner';
import Spinner from '../../components/spinner/Spinner';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

const SinglePage = ({Component, dataType}) => {
  const {id} = useParams(); // вытаскиваем comicId из params {comicId: '77343'}
  const [data, setData] = useState(null); // сюда будет приходить или объект комикса или объект персонажа в зависимости от dataType, поэтому просто дата

  const {loading, error, clearError, getComic, getCharacterByName} = useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const updateData = () => {
    clearError();

    switch (dataType) {
      case 'comic':
        getComic(id).then(onDataLoaded);
        break;
      case 'character':
        getCharacterByName(id).then(onDataLoaded);
        break;
      default:
        console.warn(`⚠ Неизвестный dataType: ${dataType}`);
    }
  };

  const onDataLoaded = data => {
    setData(data);
  };

  // 🔥 Защита от ошибки: ждем, пока char не загрузится (вариант, условный рендеринг тоже решает проблему ошибки при обновлении страицы)
  // if (!char) {
  //     return <p>Loading...</p>; // Можно заменить на спиннер
  // }

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !data) ? <Component data={data} /> : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SinglePage;
