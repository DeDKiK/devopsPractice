import React from 'react';
import './App.css';
import images from './assets/images.jpeg';

const dogImage = images;

function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <div className="dog-image">
        <img src={dogImage} alt="Dog Image" /> 
        
      </div>

      
      <div className="userInput">
        <form action="">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="surname">Surname</label>
          <input type="text" name="surname" id="surname" />
        </form>
      </div>
    </div>
  );
}

export default App;