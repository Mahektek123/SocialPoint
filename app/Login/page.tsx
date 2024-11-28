"use client"
import React, { FormEvent } from 'react';
import Navbar from '../component/Navbar';

const Page: React.FC = () => {
  let dataG: string | undefined;
  let uNameG: string | undefined;  

  const sub = async (e: FormEvent) => {
    e.preventDefault();

    const nameElement = (document.getElementById('name') as HTMLInputElement).value;
    const pswElement = (document.getElementById('psw') as HTMLInputElement).value;

    if (!nameElement || !pswElement) return;

    if (nameElement.length < 8 || pswElement.length < 8) {
      const alertContainer = document.querySelector('#uExists') as HTMLElement;
      alertContainer.style.display = 'block';

      setTimeout(() => {
        alertContainer.style.display = 'none';
      }, 3000);
      return;
    }

    const form_data = {
      name: nameElement,
      Password: pswElement
    };

    const response = await fetch(`http://localhost:3000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form_data)
    });

    const rData = await response.json();
    if(rData.message === "User Not Found"){
      const alertContainer = document.querySelector('.alert-container') as HTMLElement;
      alertContainer.style.display = 'block';
      alertContainer.innerText = rData.message;
      setTimeout(() => {
        alertContainer.style.display = 'none';
      }, 2000);
    }
    console.log(rData)
    if (rData.message === "Logged In") {
      sessionStorage.setItem("UserName", nameElement);
      sessionStorage.setItem("Que", rData.Que);
      sessionStorage.setItem("Ans", rData.Ans);
      sessionStorage.setItem("UID", rData.UID);
      
      window.location.href = "/";
    }
  };

  const forget = () => {
    const alertContainer = document.querySelector('#frgFrm') as HTMLElement;
    alertContainer.style.display = 'block';
  };

  const userNotFound = (dData: string) => {
    const alertContainer = document.querySelector('.alert-container') as HTMLElement;
    alertContainer.style.display = 'block';
    alertContainer.innerText = dData;
    setTimeout(() => {
      alertContainer.style.display = 'none';
    }, 2000);
  };

  const ForgetSub = async (e: FormEvent) => {
    e.preventDefault();

    const uNameElement = document.getElementById("nameFrg") as HTMLInputElement;
    const uNameVal = uNameElement.value;
    uNameG = uNameVal;

    const data = {
      UserName: uNameVal
    };

    const response = await fetch(`http://localhost:3000/forgetPSW`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const rData = await response.json();

    if (rData.message === "User Not Found") {
      userNotFound("User Not Found");
    } else {
      const frgFrm = document.getElementById("frgFrm") as HTMLElement;
      frgFrm.style.display = "none";
      const ansCheckFrm = document.getElementById("ansCheckFrm") as HTMLElement;
      ansCheckFrm.style.display = "block";
      const queLbl = document.getElementById("queLbl") as HTMLElement;
      queLbl.innerText = rData.Que;
      dataG = rData.ans;
    }
  };

  const checkPsw = (e: FormEvent) => {
    e.preventDefault();

    const queAnsElement = document.getElementById("QueAns") as HTMLInputElement;
    if (queAnsElement.value === dataG) {
      const upPsw = document.getElementById("upPassword") as HTMLElement;
      upPsw.style.display = "block";
      const ansCheckFrm = document.getElementById("ansCheckFrm") as HTMLElement;
      ansCheckFrm.style.display = "none";
    } else {
      const alertContainer = document.querySelector('.alert-container') as HTMLElement;
      alertContainer.style.display = 'block';
      alertContainer.innerText = "Answer Doesn't Match";
      setTimeout(() => {
        alertContainer.style.display = 'none';
      }, 2000);
    }
  };

  const UpdPsw = async (e: FormEvent) => {
    e.preventDefault();

    const newPswElement = document.getElementById("newPsw") as HTMLInputElement;
    const new_psw = newPswElement.value;

    const data = {
      new_psw: new_psw,
      uName: uNameG
    };

    const response = await fetch(`http://localhost:3000/updatePassword`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const rData = await response.json();

    const upPassword = document.getElementById("upPassword") as HTMLElement;
    upPassword.style.display = "none";

    userNotFound(rData.message);
  };

  const divert = () => {
    document.location.href = "/Regi"
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">Social Point - Log In</h3>
              </div>
              <div className="card-body">
                <form onSubmit={sub}>
                  <div className="form-group">
                    <label htmlFor="name">Username</label>
                    <input className="form-control" type='text' id='name' autoComplete='username' required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="psw">Password</label>
                    <input className="form-control" type='password' id='psw' autoComplete='current-password' required />
                  </div>
                  <div className='d-flex justify-content-between'>
                    <button type='button' className="btn btn-link p-0" onClick={forget}>Forget Password?</button>
                    <button type='button' className="btn btn-link p-0" onClick={divert} style={{ cursor: "pointer" }}>New User?</button>
                  </div>
                  <button className="btn btn-primary btn-block" id="btn">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className='forget-container' onSubmit={ForgetSub} style={{ display: "none" }} id='frgFrm'>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input className="form-control" type='text' id='nameFrg' autoComplete='username' required />
        </div>
        <button className="btn btn-primary btn-block" id="btnFrg">Get Question</button>
      </form>

      <form className='forget-container' onSubmit={checkPsw} style={{ display: "none" }} id='ansCheckFrm'>
        <div className="form-group">
          <label htmlFor="name" id='queLbl'></label>
          <input className="form-control" type='text' id='QueAns' autoComplete='username' required />
        </div>
        <button className="btn btn-primary btn-block" id="cngPsw">Change Password</button>
      </form>

      <form className='forget-container' onSubmit={UpdPsw} style={{ display: "none" }} id='upPassword'>
        <div className="form-group">
          <label htmlFor="newPsw">Enter New Password:</label>
          <input className="form-control" type='text' id='newPsw' autoComplete='Password' required />
        </div>
        <div className="form-group">
          <label htmlFor="newPswR">Enter New Password Again:</label>
          <input className="form-control" type='text' id='newPswR' autoComplete='newPassword' required />
        </div>
        <button className="btn btn-primary btn-block" id="UpPsw">Set Password</button>
      </form>

      <div className="alert-container" id='uExists' style={{ display: "none" }}>
        <p>User does Not Exist</p>
      </div>

      <div className="alert-container" id='vali' style={{ display: "none" }}>
        <p>Enter Valid Details</p>
      </div>
    </>
  );
}

export default Page;
