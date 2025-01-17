import {Component} from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';

class ErrorBoundary extends Component {
  state = {
    error: false,
  };

  // по факту это такой спец. сетСтэйт, который работает только с ошибкой
  // static getDerivedStateFromError(error) {
  //     return {error: true};  {/* возвращает объект, который будет записан в стэйт, только его, никаких сторонних операций */}
  // }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({
      error: true,
    });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage />;
    }

    return this.props.children; // компонент, который был передан внутрь ErrorBoundary
  }
}

export default ErrorBoundary;
