import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './components/Pantalla/Home';
import Juego from './components/Juego/Juego';
import EnviarReto from './components/Retos/EnviarReto';
import Login from './pages/Login';

import { home, ellipse, square } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';
import RetosRecibidos from "./components/Retos/RetosRecibidos";
import HistorialRetos from "./components/Retos/HistorialRetos";

setupIonicReact();
const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; // O un spinner de Ionic

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
            </Route>

            {user ? (
              <>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/jugar">
                  <Juego />
                </Route>
                <Route exact path="/enviar-reto">
                  <EnviarReto location={{
                    state: { puntaje: 0 }
                  }} />
                </Route>
                <Route path="/retos-recibidos" component={RetosRecibidos} exact />
                <Route path="/historial-retos" component={HistorialRetos} exact />
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </>
            ) : (
              <Route path="*">
                <Redirect to="/login" />
              </Route>
            )}
          </IonRouterOutlet>

          {user && (
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon icon={ellipse} />
                <IonLabel>Perfil</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon icon={square} />
                <IonLabel>Tab 3</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );

};

export default App;
