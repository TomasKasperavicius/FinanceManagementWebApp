import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"
import Register from "./Components/Register"
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import { UserContext, CurrentActiveAccountContext } from './Context/UserContext';
import { usePlaidLink } from 'react-plaid-link';

const App = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [user, setUser] = useState({});
    const [activeAccount, setActiveAccount] = useState({});
    const [allAccounts, setAllAccounts] = useState([]);
    const [openPlaidLink, setOpenPlaiLink] = useState(false);
    useEffect(() => {
        if (!user.userID) return
        const fetchLinkToken = async () => {
            const response = await fetch('https://localhost:7221/user/create_link_token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user.userID.toString()),
            });
            if (response.ok) {
                const { link_token } = await response.json();
                console.log(linkToken)
                setLinkToken(link_token);
            }
        };
        const fetchAccounts = async () => {
            const response = await fetch('https://localhost:7221/account/getAccounts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user.userID),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length == 0) {
                    setOpenPlaiLink(true)
                }
                else {
                    setAllAccounts([...data])
                    setActiveAccount({ ...data[0] })
                }
            }
        };
        try {
            fetchLinkToken();
            fetchAccounts();
        } catch (err) {
            console.log(err)
        }
    }, [user]);
    

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (publicToken, metadata) => {
            console.log(publicToken)
            // Get access token
            var response = await fetch('https://localhost:7221/user/get_access_token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PublicToken: publicToken }),
            });
            var { access_token } = await response.json();
            // Get all accounts
            response = await fetch('https://localhost:7221/user/accounts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ AccessToken: access_token }),
            });
            if (response.ok) {
                var data = await response.json();
                setActiveAccount({ ...data[0], accessToken: access_token });
                setAllAccounts({ ...data })
            }
            // Create account info to be saved to DB
            var accounts = data.map(() => {
                return { UserID: user.userID, AccessToken: access_token }
            }
            )
            // Add created account info
            await fetch('https://localhost:7221/account/addAccounts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(accounts),
            });
        },
        onExit: (error, metadata) => {
            if (error) {
                console.error('Plaid Link error:', error);
            }
        },
    });
    
    useEffect(() => {
        if (openPlaidLink && linkToken && ready) {
            open()
        }
    }, [openPlaidLink, linkToken, ready])
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <CurrentActiveAccountContext.Provider value={{ activeAccount, setActiveAccount }}>
                <Router>
                    <Routes>
                        <Route path="/">
                            <Route
                                index
                                element={
                                    <Home />
                                }
                            />
                            <Route
                                path="login"
                                element={<Login />}
                            />
                            <Route
                                path="register"
                                element={<Register />}
                            />
                            <Route
                                path="account"
                                element={<Dashboard allAccounts={allAccounts} openPlaid={open} ready={ready} />}
                            />
                            <Route path="*" element={<div>Not Found</div>} />
                        </Route>
                    </Routes>
                </Router>
            </CurrentActiveAccountContext.Provider>
        </ UserContext.Provider>
    );
}
export default App;
