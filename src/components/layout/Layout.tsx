import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Sidenav/Header';
import Navbar5 from './NavBar';
import Footer from './Footer';


function Layout() {
  const navigate = useNavigate();

  function handleNavigation(route: string) {
    switch(route) {
        case '/' : navigate('/');break;
        case 'home' : navigate('/home');break;
        case 'quizzes' : navigate('/quizzes');break;
        case 'new-quiz' : navigate('/new-quiz');break;
        case 'my-quizzes' : navigate('/my-quizzes');break;
        case 'quiz-results' : navigate('/quiz-results');break;
        case 'quiz-history' : navigate('/quiz-history');break;

        default: break;
    }
  }


    return (
        <>
            {/* <Header /> */}
            <div className="min-h-screen border m-4 p-4 rounded-lg shadow-sm">
                <Navbar5 handleNavigation={handleNavigation}/>
                <div className="border my-4 rounded-lg shadow-sm flex flex-col p-2">
                    <Outlet />
                </div>
                <Footer/>
            </div>
        </>
    );
    }

    export default Layout;