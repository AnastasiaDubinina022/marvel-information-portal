import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from "formik";

import './charSearchForm.scss';

const validate = (values) => {
    const errors = {};    

    if (!values.charName) {
        errors.charName = 'Обязательное поле!';
    } else if (values.charName.length < 2) {
        errors.charName = 'Минимум 2 символа для заполнения!';
    }

    return errors; 
}

const CharSearchForm = () => {

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={validate}
                onSubmit={values => console.log(JSON.stringify(values, null, 2))}>
                <Form >
                    <label className='char__search-label' htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                        id='charName' 
                        name='charName' 
                        type='text' 
                        placeholder='Enter name'/>
                        <button type="submit">find</button>
                    </div>
                    <FormikErrorMessage className='char__search-error' name='charName' component='div'/>
                </Form>
            </Formik>
        </div>
    )
} 

export default CharSearchForm;