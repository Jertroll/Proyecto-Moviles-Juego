import { Redirect, Route } from 'react-router-dom';
import Login from '../pages/Login';

const PublicRoutes = () => {
  return (
    <>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </>
  );
};

export default PublicRoutes;
