"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../component/Navbar';
import DP from '../Images/temp.png';

const Page = () => {
  const [PP, setPP] = useState<string>();
  const [userName, setUserName] = useState<string | null>(null);
  const [que, setQue] = useState<string | null>(null);
  const [ans, setAns] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = sessionStorage.getItem('UserName');
    const storedQue = sessionStorage.getItem('Que');
    const storedAns = sessionStorage.getItem('Ans');

    setUserName(storedUserName);
    setQue(storedQue);
    setAns(storedAns);
  }, []);

  const displayPP = async () => {
    if (!userName) return;

    const data = { UserName: userName };

    const response = await fetch(`http://localhost:3000/ImgBack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const rData = await response.json();

    if (rData.PP) {
      setPP(rData.PP);
    }

    const profilePicElement = document.getElementById('profiPic') as HTMLElement;
    if (profilePicElement) {
      profilePicElement.innerHTML = `
        <a class="nav-link" href="/Profile">
          <img src=${PP ? PP : DP.src} alt="Profile Picture" class="rounded-circle mr-2" style="width: 50px; height: 50px;" />
        </a>`;
    }
  };

  const displayUserPost = async () => {
    const posts = document.getElementById('posts') as HTMLElement;

    const response = await fetch(`http://localhost:3000/getUserPosts`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ UserName: userName })
    })

    const rData = await response.json()

    if (rData.message === "Post Found") {
      (document.getElementById("posts") as HTMLElement).innerHTML = "";
      (document.getElementById("posts") as HTMLElement).innerHTML += "<h2 class='text-center'> Your Posts </h2>";

      rData.Post.forEach((post: { Image: string; Caption: string; }) => {
        (document.getElementById("posts") as HTMLElement).innerHTML += `
        <div class="card mb-3">
        <div class="card-header d-flex align-items-center bg-gray">
          <img src="${PP ? PP : DP.src
          }" alt="Profile Picture" class="rounded-circle mr-2" style="width: 50px; height: 50px;">
          <span class="font-weight-bold">&nbsp;${userName}</span>
        </div>
        <center>
          <img class="w-50" src="${post.Image}" alt="Post Image" class="card-img-top">
        </center>
        <div class="card-header bg-gray">
          <p>${post.Caption}</p>
        </div>
      </div>
        `
      });

    }
  }

  useEffect(() => {
    const logElement = document.getElementById('Log');
    if (userName && logElement) {
      logElement.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>`;
    } else if (logElement) {
      logElement.innerHTML = `<a class="nav-link" href="/LogIn">Log In</a>`;
    }
    displayPP();
  }, [userName, PP]);

  const displayWarning = (warning: string) => {
    const warningElement = document.getElementById('warning')!;
    warningElement.innerHTML = `<p>${warning}</p>`;
    warningElement.style.display = 'block';

    setTimeout(() => {
      warningElement.style.display = 'none';
    }, 2000);
  };

  const nameChange = () => {
    const nameUp = document.getElementById('nameUp')!;
    nameUp.style.display = 'block';
  };

  const pswChange = () => {
    const pswUp = document.getElementById('pswUp')!;
    pswUp.style.display = 'block';
  };

  const secQueChange = () => {
    const secQueUp = document.getElementById('secQueUp')!;
    secQueUp.style.display = 'block';
  };

  const newSecSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const secQue = (document.getElementById('secQue') as HTMLSelectElement).value;
    const secAnsUp = (document.getElementById('secAnsUp') as HTMLInputElement).value;

    const data = {
      UserName: userName,
      secQue: secQue,
      secAnsUp: secAnsUp,
    };

    const response = await fetch(`http://localhost:3000/UpSec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const rData = await response.json();
    displayWarning(rData.message);

    const secQueUp = document.getElementById('secQueUp')!;
    secQueUp.style.display = 'none';

    sessionStorage.setItem('Que', secQue);
    sessionStorage.setItem('Ans', secAnsUp);
    setQue(secQue);
    setAns(secAnsUp);
  };

  const setDP = () => {
    (document.getElementById('imgPro') as HTMLInputElement).click();
  };

  const newPswSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const oldPsw = (document.getElementById('oldPsw') as HTMLInputElement).value;
    const newPsw = (document.getElementById('newPsw') as HTMLInputElement).value;
    const newPswR = (document.getElementById('newPswR') as HTMLInputElement).value;

    if (oldPsw === newPsw || newPsw !== newPswR) {
      displayWarning('Enter Valid Passwords');
      return;
    }

    const data = {
      UserName: userName,
      oldPsw: oldPsw,
      newPsw: newPsw,
    };

    const response = await fetch(`http://localhost:3000/UpPsw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const rData = await response.json();
    displayWarning(rData.message);

    const pswUp = document.getElementById('pswUp')!;
    pswUp.style.display = 'none';
  };

  const newNameSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newName = (document.getElementById('newName') as HTMLInputElement).value;

    if (userName === newName) {
      displayWarning('Old UserName And New UserName can not be Same');
      return;
    }

    const data = {
      oldName: userName,
      newName: newName,
    };

    const response = await fetch(`http://localhost:3000/UpName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const rData = await response.json();

    if (rData.message === 'User Name Has Been Updated') {
      sessionStorage.setItem('UserName', newName);
      setUserName(newName);
      displayWarning(rData.message);

      const nameUp = document.getElementById('nameUp')!;
      nameUp.style.display = 'none';
    }
  };

  const PostImg = () => {
    const imgPro = document.getElementById('imgPro') as HTMLInputElement;
    if (imgPro.files![0]) {

      const reader = new FileReader();
      reader.readAsDataURL(imgPro.files![0]);

      reader.onload = async () => {
        const data = {
          DP: reader.result,
          UserName: userName,
        };

        const response = await fetch(`http://localhost:3000/setDP`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const rData = await response.json();

        if (rData.message === 'Profile Pic Has Been Updated') {
          displayPP();
          displayWarning(rData.message);
        } else {
          displayWarning('Profile Pic Has Not Been Updated');
        }
      };
    }
  };

  displayUserPost();

  return (
    <>
      <Navbar />
      {userName && (
        <>
          <div className="container" id="proCon">
            <div id="ProfilePic">
              <div className="card-header d-flex flex-column align-items-center justify-content-center h-100">
                <img
                  src={PP ? PP : DP.src}
                  alt="DP"
                  id="ProfileImg"
                  className="rounded-circle mr-2"
                  style={{ width: "50%", height: "70%" }}
                />
                <button className="btn btn-primary btn-block mt-2" onClick={setDP}>
                  Change
                </button>
              </div>
            </div>

            <div style={{ display: "none" }}>
              <input className='form-control w-70' onChange={PostImg} type="file" id='imgPro' name="image" accept="image/*" required />
            </div>
            <div style={{ width: "3px" }}></div>
            <div id='Info'>
              <div>
                <label htmlFor="DUName">User Name : </label>
                <input type="text" className='form-control w-50' id='DUName' value={userName || ''} readOnly onFocus={(e) => e.target.blur()} />
                <button className='btn btn-primary btn-block mt-2' onClick={nameChange}>Change</button>
              </div>
              <br />
              <div>
                <label>Password : </label>
                <input type="text" className='form-control w-50' value="********" readOnly onFocus={(e) => e.target.blur()} />
                <button className='btn btn-primary btn-block mt-2' onClick={pswChange}>Change</button>
              </div>
              <br />
              <div>
                <label id='QueSec'>{que}</label>
                <input id='QueAns' type="text" value={ans || ''} className='form-control w-50' readOnly onFocus={(e) => e.target.blur()} />
                <button className='btn btn-primary btn-block mt-2' onClick={secQueChange}>Change</button>
              </div>
            </div>
            {/* </div> */}

            <div className="alert-container" id='nameUp' style={{ display: "none" }}>
              <form id='NameChange' onSubmit={newNameSet}>
                <div className="form-group">
                  <label htmlFor="oldName">Old Name : </label>
                  <input className="form-control" type='text' id='oldName' value={userName || ''} autoComplete='Name' readOnly required />
                </div>
                <div className="form-group">
                  <label htmlFor="newName">Enter New Name : </label>
                  <input className="form-control" type='text' id='newName' autoComplete='new Name' required />
                </div>
                <button className="btn btn-primary btn-block mt-2" id="UpName">Update</button>
              </form>
            </div>

            <div className="alert-container" id='pswUp' style={{ display: "none" }}>
              <form id='PswChange' onSubmit={newPswSet}>
                <div className="form-group">
                  <label htmlFor="oldPsw">Enter Old Password : </label>
                  <input className="form-control" type="password" id='oldPsw' autoComplete='Password' required />
                </div>
                <div className="form-group">
                  <label htmlFor="newPsw">Enter New Password : </label>
                  <input className="form-control" type='password' id='newPsw' autoComplete='new Password' required />
                </div>
                <div className="form-group">
                  <label htmlFor="newPswR">Enter New Password Again : </label>
                  <input className="form-control" type='password' id='newPswR' autoComplete='new Password' required />
                </div>
                <button className="btn btn-primary btn-block mt-2" id="UpPsw">Update</button>
              </form>
            </div>

            <div className="alert-container" id='secQueUp' style={{ display: "none" }}>
              <form id='SecChange' onSubmit={newSecSet}>
                <div className="form-group">
                  <label htmlFor="secQue">Security questions</label>
                  <select id="secQue" className="form-control">
                    <option value="What is your Home Name ?">What is your Home Name ?</option>
                    <option value="What is your Favourite fruit ?">What is your Favourite fruit ?</option>
                    <option value="What is your Favourite Animal ?">What is your Favourite Animal ?</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="secAnsUp">Answer</label>
                  <input className="form-control" type='text' id='secAnsUp' autoComplete='current-password' required />
                </div>
                <button className="btn btn-primary btn-block mt-2" id="UpSecQue">Update</button>
              </form>
            </div>

            <div className="alert-container" id='warning' style={{ display: "none" }}></div>
          </div>
          <div className=' container container-fluid d-flex justify-content-center mt-5'>
            <button className='btn btn-danger' onClick={() => { sessionStorage.clear(); window.location.href = '/Login'; }}>Log out</button>
          </div>

          <div className='container' id="posts">

          </div>
        </>
      )}

    </>
  );
};

export default Page;
