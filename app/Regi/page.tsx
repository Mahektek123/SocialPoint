"use client";
import React, { FormEvent } from 'react';
import Navbar from '../component/Navbar';
import { redirect } from 'next/navigation';

const Page: React.FC = () => {

    async function sub(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const nameElement = document.getElementById('name') as HTMLInputElement;
        const pswElement = document.getElementById('psw') as HTMLInputElement;
        const secAnsElement = document.getElementById('secAns') as HTMLInputElement;
        const secQueElement = document.getElementById('secQue') as HTMLSelectElement;

        if (
            nameElement?.value.length < 8 || 
            pswElement?.value.length < 8 || 
            secAnsElement?.value.length === 0
        ) {
            const alertContainer = document.querySelector('#vali') as HTMLElement;
            alertContainer.style.display = 'block';

            setTimeout(() => {
                alertContainer.style.display = 'none';
            }, 3000);

            return;
        } 

        const form_data = {
            name: nameElement.value,
            Password: pswElement.value,
            Que: secQueElement.value,
            Ans: secAnsElement.value
        };

        try {
            const response = await fetch(`http://localhost:3000/Regi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_data)
            });

            const rData = await response.json();
            console.log(rData.message)
            if (rData.message == "Data inserted") {    
                sessionStorage.setItem("UserName", nameElement.value);
                sessionStorage.setItem("Que", secQueElement.value);
                sessionStorage.setItem("Ans", secAnsElement.value);
                sessionStorage.setItem("UID", rData.UID)
                window.location.href = "/"
                console.log("erdjhb")
            }

            if (rData.message === "User already exists") {
                const alertContainer2 = document.querySelector('#uExists') as HTMLElement;
                alertContainer2.style.display = 'block';

                setTimeout(() => {
                    alertContainer2.style.display = 'none';
                }, 3000);
            }
        }
        finally{

        }
    }

    const divert = () => {
        window.location.href = "/Login";
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-center">Social Point - Registration</h3>
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
                                    <div className="form-group">
                                        <label htmlFor="secQue">Security questions</label>
                                        <select id="secQue" className="form-control">
                                            <option value="What is your Home Name ?">What is your Home Name ?</option>
                                            <option value="What is your Favourite fruit ?">What is your Favourite fruit ?</option>
                                            <option value="What is your Favourite Animal ?">What is your Favourite Animal ?</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="secAns">Answer</label>
                                        <input className="form-control" type='text' id='secAns' autoComplete='current-password' required />
                                    </div>
                                    <span onClick={divert} style={{ cursor: 'pointer', color: 'blue' }}>Already Have An Account?</span>
                                    <br />
                                    <center>
                                        <button id="btn" className="btn btn-primary btn-block">Register</button>
                                    </center>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="alert-container" id='uExists' style={{ display: "none" }}>
                    <p>User already Exists</p>
                </div>
                <div className="alert-container" id='vali' style={{ display: "none" }}>
                    <p>Enter Valid Details</p>
                </div>
            </div>
        </>
    );
};

export default Page;
