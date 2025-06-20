import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {lazy, Suspense} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';




import './app.scss';


const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SinglePage = lazy(() => import('../pages/SinglePage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharacterLayout = lazy(
  () => import('../pages/singleCharacterLayuot/SingleCharacterLayout')
);

const AnimatedRoutes = () => {
  const location = useLocation(); 

  return (
    
    <Suspense fallback={<Spinner />}>
      {}
      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}>
                <MainPage />
              </motion.div>
            }
          />
          <Route
            path="/comics"
            element={
              <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}>
                <ComicsPage />
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}>
                <Page404 />
              </motion.div>
            }
          />
          <Route
            path="/comics/:id" 
            element={
              <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}>
                <SinglePage
                  Component={SingleComicLayout}
                  dataType="comic"
                />
              </motion.div>
            }
          />
          <Route
            path="/characters/:id"
            element={
              <motion.div
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}>
                <SinglePage
                  Component={SingleCharacterLayout}
                  dataType="character"
                />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;
