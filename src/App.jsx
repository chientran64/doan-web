import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import FloatingBackground from './components/FloatingBackground';

function App() {
  return (
    <Router>
      <FloatingBackground />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu/:tableId" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
