import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"
import Register from "./Components/Register"
import Home from './Components/Home';
import AccountInfo from './Components/AccountInfo';
import { UserContext, CurrentActiveAccountContext } from './Context/UserContext';
import { usePlaidLink } from 'react-plaid-link';
import BankAccounts from './Components/BankAccounts';
import SideBar from './Components/SideBar';
import Transaction from './Components/Dashboard/Transaction';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { getUniquePropertyValues } from "./utils/helper"
import Transfer from './Components/Transfer';


const App = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [user, setUser] = useState({});
    const [activeAccount, setActiveAccount] = useState({});
    const [allAccounts, setAllAccounts] = useState([]);
    const [openPlaidLink, setOpenPlaiLink] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [bankInfos, setBankInfos] = useState([]);

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
                setActiveAccount({ ...data[0], accessToken: access_token, institutionID: metadata.institution.institution_id });
                setAllAccounts({ ...data })
            }
            // Create account info to be saved to DB
            var accounts = data.map(() => {
                return { UserID: user.userID, AccessToken: access_token, InstitutionID: metadata.institution.institution_id }
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
    useEffect(() => {
        const getTransactions = async () => {
            if (!activeAccount.accessToken) return
            const response = await fetch('https://localhost:7221/user/transactions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ AccessToken: activeAccount.accessToken }),
            });
            const data = await response.json();
            setTransactions([...data])
        }
        try {
            getTransactions();
        } catch (err) {
            console.log(err)
        }
    }, [activeAccount])
    useEffect(() => {
        if (!allAccounts) return
        const fetchBankInfos = async () => {
            const institution_ids = getUniquePropertyValues(allAccounts, 'institutionID')
            const access_tokens = getUniquePropertyValues(allAccounts, 'accessToken')
            var arr = []
            for (var i = 0; i < access_tokens.length; i++) {

                const response = await fetch('https://localhost:7221/account/get_institution_by_id/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ AccessToken: access_tokens[i], InstitutionID: institution_ids[i] }),
                });
                if (response.ok) {
                    const { institution } = await response.json();
                   arr = [...arr, institution]
                }
            }
            setBankInfos([...arr])
        }
        try {
            fetchBankInfos()
        } catch (err) {
            console.log(err)
        }
    }, [allAccounts,activeAccount])
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
                                path="dashboard"
                                element={<SideBar openPlaid={open} ready={ready} />}
                            >
                                <Route path="accounts" element={<BankAccounts bankInfos={bankInfos} allAccounts={allAccounts} />} />
                                <Route path="account" element={<AccountInfo bankInfos={bankInfos} transactions={transactions} />} />
                                <Route path="transfer" element={<Transfer />} />
                                <Route path="transactions" element={
                                    <>
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <Paper
                                                        sx={{
                                                            p: 2,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: "100%",
                                                        }}
                                                    >
                                                        <Transaction transactions={transactions} showAllFields={true} />
                                                    </Paper>
                                                </Grid>
                                             </>
                                        } />

                                    </Route><Route path="*" element={<div>Not Found</div>} />
                            </Route>
                    </Routes>

                </Router>
            </CurrentActiveAccountContext.Provider>
        </ UserContext.Provider>

    );
}
export default App;
