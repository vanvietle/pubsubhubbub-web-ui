import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      <h1>404(NotFound)</h1>
      <Link to="/">Go to home page</Link>
    </>
  );
}

export default NotFound;
