import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 text-center">
      <Link to="/" className="text-2xl font-bold">ConvertEasy</Link> 
    </header>
  );
}

export default Header;