import './App.css';
import React, { useState, useEffect } from 'react';

function Feed() {
  useEffect(() => {
    fetch('https://apu15an183.execute-api.us-west-2.amazonaws.com/TestStage/PullFeedLambda', {
      mode: 'cors'})
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error(error));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p className="toptext">
          Ejoverse 2
        </p>
        <h4 className = "middletext">
          The Real World MMO
        </h4>

        <h4 className = "bottomtext">
          Currently being built by Tengin Entertainment
        </h4>
        
      </header>
      <body className="App-body">
        <a className='App-link' href="mailto:tenginentertainment@gmail.com">tenginentertainment@gmail.com</a>
      </body>
    </div>
  );
}

export default Feed;
