import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react'

//components
import Header from 'components/Header';
import Footer from 'components/Footer';
//configs
import aws_exports from 'aws-exports';
//pages
import Songs from 'pages/songs';
//styles
import '@aws-amplify/ui-react/styles.css';
import './App.css';

// AWS configuration
Amplify.configure(aws_exports);

function App() {

  return (
    <Authenticator className='app center'>
      {({ signOut }) => (
        <div className="app">
          <Header onSignOutClick={signOut!} />
          <div className='app-body'>
            <Songs />
          </div>
          <Footer />
        </div>
      )
      }
    </Authenticator >
  );
}

export default App;
