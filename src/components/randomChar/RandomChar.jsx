import {useState, useEffect} from 'react';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const RandomChar = () => {
  const [char, setChar] = useState({});

  const {loading, error, getCharacter} = useMarvelService();  // вытаскиваем нужные сущности из вызова хука useMarvelService

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 30000);

    return () => {
      clearInterval(timerId);
    }
  }, []);

   const onCharLoaded = char => {
    setChar(char);
    // setLoading(false);  // состояния загрузки и ошибки теперь контролируются из хука useHttp
  };

  // методы onCharLoading и onError больше не нужны, т.к. состояния загрузки и ошибки теперь контролируются из хука useHttp
  // const onCharLoading = () => {
  //   setLoading(true);  
  //   setError(false);
  //   updateChar();
  // }; 

  // const onError = () => {
  //   setLoading(false);
  //   setError(true);
  // };

  const updateChar = () => {
    const id = Math.floor(Math.random() * (1011500 - 1010900) + 1010900); // диапазон айдишников в базе и выбор случайного
    getCharacter(id)  // из функции getCharacter мы получаем объект с уже трансформированными данными и устанавливаем его в стэйт
      .then(onCharLoaded)  // в .then приходит объект и автоматически подставляется аргументом в указанную ссылочную функцию
      // .catch(onError);  // блок catch теперь здесь не нужен, т.к. ошибки обрабатываются в хуке useHttp
  };

  const errorMessage = error ? <ErrorMessage /> : null; // выносим сюда сложную логику условного рендеринга
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? <View char={char} /> : null;

  return (
    <div className="randomchar">
      {/* условно рендерим один из компонентов в зависимости от ситуации. если в переменной null то на странице ничего не отобразится*/}
      {errorMessage} {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button
          className="button button__main"
          onClick={updateChar}>
          <div className="inner">try it</div>{' '}
        </button>
        <img
          src={mjolnir}
          alt="mjolnir"
          className="randomchar__decoration"
        />
      </div>
    </div>
  );
};

// рендерящий компонент, отвечающий только за отображeние, не содержащий никакой логики (вьюшка, вью), только принимает данные и отображает.
// а все запросы, логика и тд. выше в основном компоненте
const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki} = char;

  let imageClassName = 'randomchar__img';

  if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imageClassName += ' object-fit-contain';
  }

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        className={imageClassName}
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
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
  );
};

export default RandomChar;
