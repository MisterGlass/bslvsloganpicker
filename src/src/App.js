import React from 'react';
//import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
//import GoogleLogout from 'react-google-login';
import axios from 'axios';
import './App.css';

import slogans from './sloganlist.json';

class Slogan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            text: props.text,
            favfunc: props.favslogan,
            unfavfunc: props.unfavslogan,
            hidden: false,
            favorited: props.favorited,
        }
        if(props.favorited) {console.log('gotcha')};
    };

    favslogan = () => {
        this.state.favfunc();
    }

    unfavslogan = () => {
        this.state.unfavfunc();
    }

    hideslogan = () => {
        this.setState({hidden: true});
    }

    unhideslogan = () => {
        this.setState({hidden: false});
    }
    
    render() {
        if (this.state.hidden) {
            return (
                <div className="slogan hidden">
                    <button className="unhidebtn" onClick={this.unhideslogan}>
                        Show
                    </button>
                </div>
            );
        } else if (this.state.favorited) {
            return (
                <div className="slogan favorite">
                    <p>{this.state.text}</p>
                    <button className="favbtn" onClick={this.unfavslogan}>
                        Unfavorite
                    </button>
                </div>
            );
        } else {
            return (
                <div className="slogan">
                    <p>{this.state.text}</p>
                    <button className="favbtn" onClick={this.favslogan}>
                        Favorite
                    </button>
                    <button className="hidebtn" onClick={this.hideslogan}>
                        Hide
                    </button>
                </div>
            );
        }
    }
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
        var mainslogans = slogans.slice();
        mainslogans.forEach(function(slogan) {
            slogan.favorited = false;
        });

        super(props);
        this.state = {
            favorites: [],
            user: null,
            submitted: false,
            slogans: mainslogans,
        };
    }

    favSlogan(key, slogan) {
        const favorites = this.state.favorites.slice();
        favorites.push(slogan);

        const mainslogans = this.state.slogans.slice();
        for (var i = 0; i < mainslogans.length; i++) { 
            if (mainslogans[i].id === slogan.id) {
                mainslogans[i].favorited = true;
                break;
            }
        }

        this.setState({favorites: favorites, slogans: mainslogans});
    }

    unfavSlogan(key, slogan) {
        const favorites = this.state.favorites.slice();
        for (var i = 0; i < favorites.length; i++) { 
            if (favorites[i].id === slogan.id) {
                favorites.splice(i, 1);
                break;
            }
        }

        const mainslogans = this.state.slogans.slice();
        for (i = 0; i < mainslogans.length; i++) { 
            if (mainslogans[i].id === slogan.id) {
                mainslogans[i].favorited = false;
                break;
            }
        }

        this.setState({favorites: favorites, slogans: mainslogans});
    }

    renderSlogan(key, slogan) {
        return (
            <Slogan 
                key={key}
                id={slogan.id}
                text={slogan.slogan}
                favslogan={() => this.favSlogan(key, slogan)}
                unfavslogan={() => this.unfavSlogan(key, slogan)}
                favorited={slogan.favorited}
            />
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

    submitVote = () => {
        if (window.confirm('Are you sure these are what you want to submit?')) {
            var actionurl = "https://docs.google.com/forms/d/e/1FAIpQLSfoltL6Tpy9O3C-egmhu4sgyW8QKqC1oYQvaL5mmmpOjj-GbA/formResponse";
            var usernamefield = "entry.1281984272";
            var jsonfield = "entry.1106511397";
            var corsproxy = 'https://cors-anywhere.herokuapp.com/';
            var favids = this.state.favorites.map((slogan) => {
                return slogan.id;
            });

            const formData = new FormData()
            formData.append(usernamefield, this.state.user.email)
            formData.append(jsonfield, JSON.stringify(favids))
            axios.post(corsproxy + actionurl, formData)
            .then(() => {
                this.setState({
                message: '',
                email: ''
                })
            }).catch(() => {
                this.setState({
                    messageError: true,
                })
            })
            
            this.setState({submitted: true});
        }
    }

    render() {
        if (this.state.user == null) {
            return (
                <div style={{padding: "20px"}}>
                    Please log in with your BSidesLV account to continue<br /><br />
                    <GoogleLogin
                        clientId="693738722966-m2uhbrdhrsb1el7u0uiomj1lmov1bbrr.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            )
        } else if (this.state.submitted) {
            return (
                <div style={{padding: "20px"}}>
                    Thank you for submitting your slogan nominations!
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Welcome to the BSidesLV slogan nominations!</h2>
                    <p>
                        Every staff member is allowed to pick up to 10 for nominations. The top 10 will be put to a public vote.<br />
                        If you like a slogan, click on favorite &amp; it will be added to your favorites list on the right. Once you are done reviewing slogans, click submit to send us your nominations.<br />
                        Note: you can add however many slogans you like to your favorites, but if you have more than 10 you will need to remove them from your list before submitting.<br />
                    </p>
                    <div className="slogans">
                        {this.state.slogans.map((slogan, i) => {
                            return this.renderSlogan(i, slogan);
                        })}
                    </div>
                    <div className="favorites">
                        {this.state.favorites.map((slogan, i) => {
                            return this.renderFavorite(i, slogan);
                        })}
                        <p>You currently have selected {this.state.favorites.length} slogans.</p>
                        {this.state.favorites.length > 0 ? (
                            this.state.favorites.length <= 10 ? (
                                <button className="submitbtn" onClick={this.submitVote} >
                                    Submit
                                </button>
                            ) : (
                                <h2>Too many slogans selected, please remove some to submit.</h2>
                            )
                        ): (
                            <h2>Choose some slogans</h2>
                        ) }
                    </div>
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
