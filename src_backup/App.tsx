import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage initialTab="compare" />} />
        <Route path="/compare" element={<HomePage initialTab="compare" />} />
        <Route path="/settlement" element={<HomePage initialTab="settlement" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
