import React from 'react';

import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { About } from './about/about';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || "");

    //asynchronously determine if the user is authenticated by callin the service
    const [authState, setAuthState] = React.useState(AuthState.Unknown);
    React.useEffect(() => {
        if(userName) {
            fetch(`api/use/${userName}`)
                .then((response) => {
                    if(response.status === 200) {
                        return response.json();
                    }
                })
                .then((user) => {
                    const state = user?.authenticated ? AuthState.Authenticated : AuthState.Unauthenticated;
                    setAuthState(state);
                });
        } else {
            setAuthState(AuthState.Unauthenticated);
        }
    }, [userName]);

    return (
        <div className='body bg-dark text-light'>
            
        </div>
    );
}