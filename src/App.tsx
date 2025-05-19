import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, home, square } from "ionicons/icons";
import Home from "./pages/Home";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

setupIonicReact();

const App: React.FC = () => {
  const { user } = useAuth();

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
                <Route exact path="/tab2">
                  <Tab2 />
                </Route>
                <Route exact path="/tab3">
                  <Tab3 />
                </Route>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </IonRouterOutlet>

          {/* Menú de tabs SOLO cuando hay usuario */}
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