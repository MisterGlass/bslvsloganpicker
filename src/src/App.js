import React from 'react';
//import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import GoogleLogout from 'react-google-login';
import './App.css';

import slogans from './sloganlist.json';

function Slogan(props) {
    return (
        <div className="slogan">
            <p>{props.text}</p>
            <button className="favbtn" onClick={props.favslogan}>
                Favorite
            </button>
            <button className="hidebtn" onClick={function() { alert('click'); }}>
                Hide
            </button>
        </div>
    );
}

function Favorite(props) {
    return (
        <div className="slogan">
            <p>{props.text}</p>
            <button className="unfavbtn" onClick={props.unfavslogan}>
                Remove
            </button>
        </div>
    );
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            user: null,
        };
    }

    favSlogan(key, slogan) {
        const favorites = this.state.favorites.slice();
        favorites[key] = slogan;
        this.setState({favorites: favorites});
    }

    unfavSlogan(key, slogan) {
        const favorites = this.state.favorites.slice();
        favorites.splice(key, 1);
        this.setState({favorites: favorites});
    }

    renderSlogan(key, slogan) {
        return (
            <Slogan key={key} text={slogan.slogan} favslogan={() => this.favSlogan(key, slogan)} />
        )
    }

    renderFavorite(key, slogan) {
        return (
            <Favorite key={key} text={slogan.slogan} unfavslogan={() => this.unfavSlogan(key, slogan)} />
        )
    }

    logout = () => {
        this.setState({user: null});
    }

    responseGoogle = (response) => {
        if (response.profileObj.email.split('@')[1] === 'bsideslv.org') {
            this.setState({user: response.profileObj});
        } else {
            alert('Login unsucesful, please login with your bsideslv google account');
        };
    }

    render() {
        if(this.state.user == null) {
            return (
                <GoogleLogin
                    clientId="693738722966-m2uhbrdhrsb1el7u0uiomj1lmov1bbrr.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            )
        } else {
            return (
                <div>
                    <div className="slogans">
                        {slogans.map((slogan, i) => {
                            return this.renderSlogan(i, slogan);
                        })}
                    </div>
                    <hr />
                    <div className="favorites">
                        {this.state.favorites.map((slogan, i) => {
                            console.log('rendering fav');
                            return this.renderFavorite(i, slogan);
                        })}
                    </div>
                    <GoogleLogout
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}
                    />
                </div>
            );
        }
    }
}

function App() {
    return (
        <div className="App">
            <Main />
        </div>
    )
}

export default App;
