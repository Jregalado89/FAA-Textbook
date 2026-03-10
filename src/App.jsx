import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookSelector from './pages/BookSelector';
import Reader from './pages/Reader';
import Search from './pages/Search';
import Glossary from './pages/Glossary';
import AllNotes from './pages/AllNotes';
import Quizzes from './pages/Quizzes';
import Trainers from './pages/Trainers';
import './styles/main.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookSelector />} />
        <Route path="/reader/:bookId" element={<Reader />} />
        <Route path="/reader/:bookId/:chapterId" element={<Reader />} />
        <Route path="/search" element={<Search />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/notes" element={<AllNotes />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
