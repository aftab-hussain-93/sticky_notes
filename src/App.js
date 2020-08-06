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
        token:null
      },
    };
  }

  onRouteChange = (name) => {
    console.log("Route change to ", name);
    this.setState({ route: name });
  };

  loadUser = (user) => {
    this.setState({ isSignedIn: true, user: user },()=>{
      this.setState({route: "home", user: user})
    });
  };

  unLoadUser = () => {
    console.log("Unloading User");
    this.setState({
      isSignedIn: false,
      user:null
    });
  };

  render() {
    const {isSignedIn, route, user } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          unLoadUser={this.unLoadUser}
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        { route === "home" ? (
          <NotesList 
            user={isSignedIn?{name:user.name,token:user.token}:null}/>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} 
            unLoadUser={this.unLoadUser} 
            onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            unLoadUser = {this.unLoadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
