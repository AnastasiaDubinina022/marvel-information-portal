import {useNavigate} from 'react-router-dom';

import './singleCharacterLayout.scss';

const SingleCharacterLayout = ({data}) => {
  const {thumbnail, name, description} = data;
  const navigate = useNavigate();

  return (
    <div className="single-comic">
      <img
        src={thumbnail}
        alt={name}
        className="single-comic__img"
      />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
      <button
        className="single-comic__back"
        // onClick={handleGoBack}
        onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default SingleCharacterLayout;
