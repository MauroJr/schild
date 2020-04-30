import React from 'react';
import './App.css';
import { Board } from './components/Board';
import { addNewColumn, addNewCard } from './services/http';

const board = {
  columns: [
    {
      id: 1,
      title: 'Todo',
      cards: [
        {
          id: 1,
          title: 'Task 1',
          description: 'Task 1 Description',
        },
      ],
    },
    {
      id: 2,
      title: 'Doing',
      cards: [
        {
          id: 2,
          title: 'Task 2',
          description: 'Task 2 Description',
        },
      ],
    },
    {
      id: 3,
      title: 'Done',
      cards: [],
    },
  ],
};

function App() {
  return (
    <div className="App">
      <Board
        initialBoard={board}
        onAddColumn={addNewColumn}
        onAddCard={addNewCard}
      />
    </div>
  );
}

export default App;
