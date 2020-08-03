import React from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import NotesList from "./components/NotesList/NotesList";
import "./App.css";

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      route: "home",
      isSignedIn: false,
      user: {
        name: null,
        email: null,
        id: null,
      },
    };
  }

  onRouteChange = (name) => {
    console.log("Route change to ", name);
    this.setState({ route: name });
  };

  loadUser = (user) => {
    console.log("Loading user", user);
    this.setState({ isSignedIn: true, user: user });
  };

  unLoadUser = () => {
    console.log("Unloading User");
    this.setState({
      isSignedIn: false
    });
  };

  render() {
    const {isSignedIn, route } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          unLoadUser={this.unLoadUser}
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        { route === "home" ? (
            <NotesList />
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
