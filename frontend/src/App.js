import { Route, Routes, Link } from "react-router-dom";
import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-5">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                onClick={logout}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<RestaurantsList />} exact />
          <Route path="/restaurants" element={<RestaurantsList />} />
          <Route
            path="/restaurants/:id"
            render={(props) => <Restaurant {...props} user={user} />}
            element={<Restaurant user={user} />}
          />
          <Route
            path="/restaurants/:id/review"
            render={(props) => <AddReview {...props} user={user} />}
            element={<AddReview user={user} />}
          />

          <Route
            path="/login"
            render={(props) => <Login {...props} login={login} />}
            component={Login}
          />
        </Routes>
      </div>

      {/* <div className="container mt-3">
        <Switch>
          <Route
            exact
            path={["/", "/restaurants"]}
            component={RestaurantsList}
          />
          <Route
            path="/restaurants/:id/review"
            render={(props) => <AddReview {...props} user={user}></AddReview>}
          />
          <Route
            path="/restaurants/:id"
            render={(props) => <Restaurant {...props} user={user} />}
          />
          <Route
            path="/login"
            render={(props) => <Login {...props} login={login} />}
          />
        </Switch>
      </div> */}
    </div>
  );
}

export default App;
