import {useHttp} from '../hooks/http.hook';
import upgradeToHttps from '../utils/upgradeToHttps';

// Alternative API base URL and key if if the main api does not work
// const _apiBase = 'https://marvel-server-zeta.vercel.app/'; 
// const _apiKey = 'd4eecb0c66dedbfae4eab45d312fc1df';

const useMarvelService = () => {
  const {process, setProcess, request, clearError} = useHttp(); 

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; 
  const _apiKey = 'apikey=48016fbc64705610f2040226da4655f7';
  const _baseOffSet = 210;

  const getAllCharacters = async (offset = _baseOffSet) => {
    const result = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);

    return result.data.results.map(char => _transformCharacter(char)); 
  };

  const getCharacter = async id => {
    const result = await request(`${_apiBase}characters/${id}?${_apiKey}`); 

    if (!result) {
      console.warn(`⚠ Персонаж с ID ${id} не найден, показываем заглушку`);
      return {name: 'Unknown Character', description: 'No data available', thumbnail: 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'};
    }

    return _transformCharacter(result.data.results[0]); 
  };

  const _transformCharacter = char => {
    return {
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 200)}...`
        : 'There is no description for this character.',
      thumbnail: upgradeToHttps(char.thumbnail.path + '.' + char.thumbnail.extension),  
      id: char.id,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const getAllComics = async (offset = 0) => {
    const result = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );

    return result.data.results.map(comics => _transformComics(comics));
  };

  const getComic = async id => {
    const result = await request(`${_apiBase}comics/${id}?${_apiKey}`);

    return _transformComics(result.data.results[0]);
  };

  const _transformComics = comics => {
    return {
      id: comics.id,
      title: comics.title,
      price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'Not available',
      description: comics.description || 'There is no description',
      pageCount: comics.pageCount
        ? `${comics.pageCount} h.`
        : 'No information about the number of pages',
      thumbnail: upgradeToHttps(comics.thumbnail.path + '.' + comics.thumbnail.extension),
      language: comics.textObjects.language || 'en-us',
      url: comics.urls[0].url,
    };
  };

  const getCharacterByName = async charName => {
    const result = await request(`${_apiBase}characters?name=${charName}&${_apiKey}`);

    if (!result.data.results[0]) {
      return {};
    }
    return _transformCharacter(result.data.results[0]);
  };

  return {
    process,
    setProcess,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
    getCharacterByName,
  };
};

export default useMarvelService;
