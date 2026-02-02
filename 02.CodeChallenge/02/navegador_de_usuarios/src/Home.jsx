import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/user/1">User 1</Link>
        <Link to="/user/2">User 2</Link>
        <Link to="/user/3">User 3</Link>
        <Link to="/user/4">User 4</Link>
      </nav>
    </div>
  );
}