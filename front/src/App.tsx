// App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import BrowseRecipePage from './pages/BrowseRecipePage';
import CreateRecipePage from './pages/CreateRecipePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import RecipePage from './pages/RecipePage';
import UserProfileWrapper from './pages/UserProfileWrapper';
import './App.css';

// Main App component with routing
function App(): React.ReactElement {
  return (
    <div className="App">
      <main className="App-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<BrowseRecipePage />} />
          <Route path="/create" element={<CreateRecipePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/user/:id" element={<UserProfileWrapper />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
