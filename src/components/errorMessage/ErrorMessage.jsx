import './errorMessage.scss';

import ErrorImage from './img/error.gif';

const ErrorMessage = () => {
  return (
    <img
      src={ErrorImage}
      className="error-message-img"
      alt="Error message"
    />
  );
};

export default ErrorMessage;
