'use client'

import { useState, useEffect } from 'react';

const Home = () => {
  const [registered, setRegistered] = useState(false);
  const [username, setUsername] = useState('');
  const [pokerPoints, setPokerPoints] = useState(0);
  const [output, setOutput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080/ws");
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      setOutput(() =>  event.data + "<br>");
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const registerUser = () => {
    if (username) {
      const message = {
        type: "register",
        data: {
          username: username
        }
      };
      sendMessage(JSON.stringify(message));
    }
    setRegistered(true);
  };

  const submitPokerPoint = () => {
    if (username && pokerPoints) {
      const message = {
        type: "submit",
        data: {
          pokerPoints: pokerPoints
        }
      };
      sendMessage(JSON.stringify(message));
    //  setPokerPoints(0); // Reset poker points input field
    }
  };

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  return (
    <div>
      <h1>Poker!</h1>
      <div>
        {registered ? (
          // If registered is true, render the input form for pokerPoints
          <div>
            <h2>Welcome, {username}!</h2>
            <label>
              Poker Points:
              <input
                type="number"
                value={pokerPoints}
                onChange={(e) => setPokerPoints(+e.target.value)}
              />
            </label>
            <button onClick={submitPokerPoint}>Submit</button>
          </div>
        ) : (
          // If registered is false, render the input form for username registration
          <div>
            <h2>Register Username</h2>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <button onClick={registerUser}>Register</button>
          </div>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: output }} />
    </div>
  );
};

export default Home;
