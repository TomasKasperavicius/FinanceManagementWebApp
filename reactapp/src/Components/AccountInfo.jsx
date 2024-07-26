import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Dashboard/Chart';
import Deposits from './Dashboard/Deposits';
import { CurrentActiveAccountContext } from '../Context/UserContext';
import Transaction from './Dashboard/Transaction';


export default function AccountInfo() {

    const { activeAccount } = useContext(CurrentActiveAccountContext);

    const [transactions, setTransactions] = useState([]);
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

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                width: "100%"
            }}
        >
            <Toolbar />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Spending categories chart */}
                    <Grid item xs={12} md={12} lg={7}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                            }}
                        >
                            <Chart transactions={transactions} />
                        </Paper>
                    </Grid>
                    {/* Balance */}
                    <Grid item xs={12} md={12} lg={5}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                            }}
                        >
                            <Deposits />
                        </Paper>
                    </Grid>
                    {/* Transactions */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Transaction transactions={transactions} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
