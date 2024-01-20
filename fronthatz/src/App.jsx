import { useState} from 'react'
import './App.css'
import axios from  'axios'
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import Header from "./nav/Header.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from "./admin/AdminDashboard.jsx";
import UserDashboard from "./admin/UserDashboard.jsx";
import {UserProvider} from "./components/UserContext.jsx";
import DevicesAndUsersPage from "./admin/DevicesAndUsersPage.jsx";
import ChatPage from "./components/ChatPage.jsx";



export default function App() {
    const [user, setUser] = useState({});
    const [redirectToHomePage, setRedirectToHomePage] = useState(false);

    // When 'user.name' becomes defined, set 'redirectToHomePage' to true
    if (user.name && !redirectToHomePage) {
        setRedirectToHomePage(true);
    }

    return (
        <Router>
            <UserProvider>
                <Header/>
                <Routes>
                    <Route path="/home" component={HomePage}/>
                    <Route path="/login" element={<LoginPage user={user} setUser={setUser}/>}/>
                    <Route path="/admin-dashboard/:adminId" element={<AdminDashboard/>}/>
                    <Route path="/user-dashboard/:name" element={<UserDashboard name/>}/>
                    <Route path="/devices-and-users" element={<DevicesAndUsersPage />} />
                    <Route path="/chat" element={<ChatPage/>}/>

                </Routes>
            </UserProvider>
        </Router>
    );
}


