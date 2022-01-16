import auth0 from 'auth0-js';
import io from 'socket.io-client';
import store from '../store/configureStore'
import { leaderboardFetchDataSuccess, profileFetchDataSuccess, groupsFetchDataSuccess } from '../actions';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_API_URL,
      responseType: 'token id_token',
      scope: this.requestedScopes
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
    this.socket = io.connect(`${process.env.REACT_APP_API_URL}/private`, {
      query: {token: authResult.idToken}
    });
    this.socket.on('disconnect', () => {
      console.log('disconnecting')
      this.socket.open();
    });
    this.socket.on('leaderboard', function(leaderboard) {
      store.dispatch(leaderboardFetchDataSuccess(leaderboard))
    });
    this.socket.on('profile', function(profile) {
      store.dispatch(profileFetchDataSuccess(profile))
    });
    this.socket.on('picks', function(picks) {
      store.dispatch(groupsFetchDataSuccess(picks))
    });
    this.socket.emit('profile');
  }

  signOut() {
    this.auth0.logout({
      returnTo: process.env.REACT_APP_CLIENT_URL,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
