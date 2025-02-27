import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {lazy, Suspense} from 'react';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';

import './app.scss';

// 0,99 Mb
const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));

const AnimatedRoutes = () => {
  const location = useLocation();  // получаем текущий маршрут - объект location, содержащий информацию о текущем URL (ниже используем location.pathname, чтобы отслеживать изменения маршрута)

  return (
    <Suspense fallback={<Spinner />}>  {/** Suspense компонент-обертка для элементов lazy, fallback - комп.который будем показывать пока идет подгрузка компонентов в Suspense */}
        <Routes location={location}>
          <Route
            path="/"
            element={<MainPage />}
          />
          <Route
            path="/comics"
            element={<ComicsPage />}
          />
          <Route
            path="*"
            element={<Page404 />}
          />
          <Route
            path="/comics/:comicId" // динамическое формирование пути (:comicId - ключ называем как хотим)
            element={<SingleComicPage />}
          /> 
        </Routes>
    </Suspense>
  )
}

const App = () => {
  return (
      <Router>
      <div className="app">
        <AppHeader />
        <main>
          <AnimatedRoutes/>
        </main>
      </div>
    </Router>
  );
};

export default App;

