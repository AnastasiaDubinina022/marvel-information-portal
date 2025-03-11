import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../../components/appBanner/AppBanner';

const SinglePage = ({Component, dataType}) => {
  const {id} = useParams(); // вытаскиваем comicId из params {comicId: '77343'}
  const [data, setData] = useState(null); // сюда будет приходить или объект комикса или объект персонажа в зависимости от dataType, поэтому просто дата

  const {process, setProcess, clearError, getComic, getCharacterByName} = useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const updateData = () => {
    clearError();

    switch (dataType) {
      case 'comic':
        getComic(id)
          .then(onDataLoaded)
          .then(() => setProcess('confirmed'));
        break;
      case 'character':
        getCharacterByName(id)
          .then(onDataLoaded)
          .then(() => setProcess('confirmed'));
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

  // const errorMessage = error ? <ErrorMessage /> : null;
  // const spinner = loading ? <Spinner /> : null;
  // const content = !(loading || error || !data) ? <Component data={data} /> : null;

  return (
    <>
      <AppBanner />
      {setContent(process, Component, data)}
    </>
  );
};

export default SinglePage;
