import React, { useState, useEffect } from 'react';
import './App.css';
import images from './assets/images.jpeg';

const dogImage = images;

function App() {
  const [name, setName] = useState('John');
  const [surname, setSurname] = useState('Smith');

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);

  // 1. Завантаження даних із бази при старті додатка
  useEffect(() => {
    fetch('http://localhost:3000/get-profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setName(data.name);
        if (data.surname) setSurname(data.surname);
      })
      .catch((err) => console.error('Помилка завантаження:', err));
  }, []);

  // 2. Функція для збереження даних у базу
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname }),
      });

      const result = await response.json();
      alert(result.message); // Виведе "Profile updated successfully!"
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('Не вдалося зберегти дані');
    }
  };

  return (
    <div className="App">
      <h1>Hello {name} {surname}!</h1>

      <div className="dog-image">
        <img src={dogImage} alt="Dog Image" />
      </div>

      <div className="userInput">
        <div className="userInfo">
          <h4>Name:</h4>
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            />
          ) : (
            <p
              onClick={() => setIsEditingName(true)}
              style={{ cursor: 'pointer', margin: '5px 0' }}
            >
              {name}
            </p>
          )}

          <h4>Surname:</h4>
          {isEditingSurname ? (
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              autoFocus
              onBlur={() => setIsEditingSurname(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingSurname(false)}
            />
          ) : (
            <p
              onClick={() => setIsEditingSurname(true)}
              style={{ cursor: 'pointer', margin: '5px 0' }}
            >
              {surname}
            </p>
          )}
        </div>

        <div className="buttons">
          {/* Додано обробник кліку для збереження */}
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          
          <button 
            onClick={() => {
              setIsEditingName(true);
              setIsEditingSurname(true);
            }}
          >
            Edit Both
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;