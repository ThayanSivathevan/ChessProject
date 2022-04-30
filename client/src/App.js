import logo from './logo.svg';
import './App.css';
import Chess from './screens/Chess';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/home" element={<HomePage />}>

        </Route>
        <Route exact path="/chess/:gameID/:playerNum/:name" element={<Chess />}>
          
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
