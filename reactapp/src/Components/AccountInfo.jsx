import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Dashboard/Chart';
import Deposits from './Dashboard/Deposits';
import Transaction from './Dashboard/Transaction';
import { Navigate } from "react-router-dom";
import { UserContext } from '../Context/UserContext';
import { useContext } from "react";
export default function AccountInfo({ bankInfos, transactions }) {
    const { user } = useContext(UserContext);
    if (!user.LoggedIn) {
        return <Navigate to="/" replace />;
    }
    return (<>

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
                <Deposits bankInfos={bankInfos} />
            </Paper>
        </Grid>
        {/* Transactions */}
        <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Transaction transactions={transactions} />
            </Paper>
        </Grid>
    </>
    );
}
