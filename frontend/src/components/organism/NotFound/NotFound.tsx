import React from 'react';
import { Link } from 'react-router-dom';
import link from 'config/link';

import './NotFound.scss';

function NotFound() {
  return (
    <div className="notfound">
      <div>
        <span className="notfound__title">404</span>
        <span>This page is missing!</span>
      </div>
      <div className="notfound__opt">
        <Link to={link.home}>
          <button>홈으로</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;