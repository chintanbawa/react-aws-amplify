import React from 'react';
import {Amplify} from 'aws-amplify'
import awsConfig from './aws-exports'
import {Authenticator} from '@aws-amplify/ui-react'

//styles
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure(awsConfig)

function App() {
  return (
    <Authenticator className='App'>
      {({ signOut, user }) => (
        <div className="App">
          <p>
            Hey {user?.username}, welcome to my website, with auth!
          </p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
