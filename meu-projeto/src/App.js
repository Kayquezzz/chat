import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SuperChat from './Pages/SuperChat';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/superchat" element={<SuperChat />} />
            </Routes>
        </Router>
    );
};

export default App;
