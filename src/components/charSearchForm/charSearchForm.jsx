import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';

import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charSearchForm.scss';

const CharSearchForm = () => {
  const [char, setChar] = useState(null);

  const {process, setProcess, clearError, getCharacterByName} = useMarvelService();

  const onCharLoaded = char => {
    setChar(char);
  };

  const updateChar = name => {
    clearError();

    getCharacterByName(name)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  };

  const errorMessage =
    process === 'error' ? (
      <div className="char__search-critical-error">
        <ErrorMessage />
      </div>
    ) : null;

  const results = !char ? null : char.name ? (
    <div className="char__search-wrapper">
      <div className="char__search-success">There is! Visit {char.name} page?</div>
      <Link to={`/characters/${char.name}`}>
        <button className="button button__secondary">
          <div className="inner">to page</div>
        </button>
      </Link>
    </div>
  ) : (
    <div className="char__search-error">
      This character was not found. Check the name and try again
    </div>
  );

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          charName: '',
        }}
        validationSchema={Yup.object({
          charName: Yup.string().required('Required field!'),
        })}
        onSubmit={({charName}) => {
          updateChar(charName);
        }}>
        <Form>
          <label
            className="char__search-label"
            htmlFor="charName">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field
              id="charName"
              name="charName"
              type="text"
              placeholder="Enter name"
            />
            <button
              type="submit"
              className="button button__main"
              disabled={process === 'loading'}>
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage
            className="char__search-error"
            name="charName"
            component="div"
          />
        </Form>
      </Formik>
      {errorMessage}
      {results}
    </div>
  );
};

export default CharSearchForm;
