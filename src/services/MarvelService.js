// здесь обычный класс с методами на чистом js
class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // _ говорит другим программистам что эти данные нельзя менять
  _apiKey = 'apikey=48016fbc64705610f2040226da4655f7';
  _baseOffSet = 210;

  getResourse = async url => {
    let result = await fetch(url);

    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
  };

  // делаем функцию асинхронной, поскольку для создания const result нужно дождаться ответа в getResourse
  getAllCharacters = async (offset = this._baseOffSet) => {
    const result = await this.getResourse(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    ); // сюда приходит ответ от сервера с массивом больших объектов персонажей

    return result.data.results.map(char => this._transformCharacter(char)); // получаем массив уже трансформированных объектов
  };

  getCharacter = async id => {
    const result = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`); // сюда помещаем ответ от сервера с большим объектом данных

    // ретерним уже трансформированные, только нужные нам данные
    return this._transformCharacter(result.data.results[0]); // (объект персонажа)
  };

  _transformCharacter = char => {
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
}

export default MarvelService;

// using example
// marvelService.getCharacter(1011052).then(result => console.log(result));    // вызываем метод и обрабатываем результат
// const marvelService = new MarvelService(); // создаем экземпляр класса
// marvelService
// .getAllCharacters()
// .then(result => result.data.results.forEach(item => console.log(item.name))); // получаем имена персонаже из массива данных - можем получить любые конкретные данные и что-то с ними сделать
