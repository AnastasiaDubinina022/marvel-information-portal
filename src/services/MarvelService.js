import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
  const {loading, error, request, clearError} = useHttp(); // вытаскиваем сущности функционала из объекта useHttp

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // _ говорит другим программистам что эти данные нельзя менять
  const _apiKey = 'apikey=48016fbc64705610f2040226da4655f7';
  const _baseOffSet = 210;

  // делаем функцию асинхронной, поскольку для создания const result нужно дождаться ответа запроса
  const getAllCharacters = async (offset = _baseOffSet) => {
    const result = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`); // сюда приходит ответ от сервера с массивом больших объектов персонажей

    return result.data.results.map(char => _transformCharacter(char)); // получаем массив уже трансформированных объектов
  };

  const getCharacter = async id => {
    const result = await request(`${_apiBase}characters/${id}?${_apiKey}`); // сюда помещаем ответ от сервера с большим объектом данных

    // ретерним уже трансформированные, только нужные нам данные
    return _transformCharacter(result.data.results[0]); // (объект персонажа)
  };

  const _transformCharacter = char => {
    // трансформация данных, превращает большой объект полученный с сервера в небольшой объект только с нужными нам данными
    return {
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 200)}...`
        : 'There is no description for this character.',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
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
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      language: comics.textObjects.language || 'en-us',
      url: comics.urls[0].url,
    };
  };

  const getCharacterByName = async charName => {
    const result = await request(`${_apiBase}characters?name=${charName}&${_apiKey}`);

    return _transformCharacter(result.data.results[0]);
  };

  // поскольку это кастомный хук из него мы можем вернуть необходимые сущности для дальнейшего использования в других компонентах
  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
    getCharacterByName,
  };
};

export default useMarvelService;
