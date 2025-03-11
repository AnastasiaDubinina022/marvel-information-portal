import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

const setContent = (process, Component, data) => {
  // если логика этой функции повторяется в др. клмпонентах её можно вынести в отдельный файл и импортировать по необходимости
  // так же можно поместить внутрь http.hook но лучше так не делать т.к. жто уже не совсем относится к логике хука.
  switch (process) {
    case 'waiting':
      return <Skeleton />;
    // break;  // если в case есть return то break не обязателен, код дальше по кейсам не пойдет
    case 'loading':
      return <Spinner />;
    case 'confirmed':
      return <Component data={data} />;
    case 'error':
      return <ErrorMessage />;
    default:
      throw new Error('Unexpected process state');
  }
};

export default setContent;
