import './App.css';
import Login from './Login';
import './Login.css';
import Logout from './Logout';

function App() {
  return (
    <div className="App">
      <header>
        <Login />
        <Logout />
      </header>
    </div>
  );
}

export default App;
