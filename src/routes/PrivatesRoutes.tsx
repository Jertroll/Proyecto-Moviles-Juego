import { Redirect, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import Tab4 from '../pages/Tab4';
import Suscribir from '../pages/Suscribir';

const PrivateRoutes = () => {
  return (
    <>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/tab2">
        <Tab2 />
      </Route>
      <Route exact path="/tab3">
        <Tab3 />
      </Route>
      <Route exact path="/suscribir">
        <Suscribir />
      </Route>
      <Route exact path="/tab4">
        <Tab4 />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default PrivateRoutes;
