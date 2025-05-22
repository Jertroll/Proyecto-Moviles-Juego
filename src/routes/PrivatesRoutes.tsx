import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Tab2 from "../pages/Tab2";
import Tab3 from "../pages/Tab3";
import Tab4 from "../pages/Tab4";
import Suscribir from "../pages/Suscribir";
import EnviarReto from "../components/Retos/EnviarReto";

const PrivateRoutes = () => {
  return (
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route exact path="/tab2" component={Tab2} />
      <Route exact path="/tab3" component={Tab3} />
      <Route exact path="/tab4" component={Tab4} />
      <Route exact path="/suscribir" component={Suscribir} />

      <Route
        exact
        path="/enviar-reto"
        render={(props) => <EnviarReto {...props} />}
      />

      <Redirect to="/home" />
    </Switch>
  );
};

export default PrivateRoutes;
