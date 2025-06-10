import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../../components/appBanner/AppBanner';

const SinglePage = ({Component, dataType}) => {
  const {id} = useParams(); 
  const [data, setData] = useState(null); 

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

  
  
  
  

  
  
  

  return (
    <>
      <AppBanner />
      {setContent(process, Component, data)}
    </>
  );
};

export default SinglePage;
