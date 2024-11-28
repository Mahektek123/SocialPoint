import React from 'react';


const Navbar: React.FC = () => {

  return (
    <>
    
      <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ padding: "10px 20px" }}>
        <div className="container-fluid collapse navbar-collapse" id="navbarSupportedContent">
          <a className="navbar-brand" href="/">SP</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav" id="Log">
            </ul>
            <div id="profiPic">
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
