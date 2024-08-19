import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import BankCard from './BankCard';
import ClipboardCopy from "./ClipboardCopy"
import * as React from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from '../Context/UserContext';
import { useContext } from "react";

export default function BankAccounts({ bankInfos, allAccounts }) {
    const { user } = useContext(UserContext);
    if (!user.LoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return (
        <>
            {allAccounts &&
            allAccounts.map((account, id) => {
                return (
                    <React.Fragment key={id}><Grid item xs={12} md={8} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 400,
                            }}
                        >
                            <BankCard bankInfos={bankInfos} account={account} showBalance={false} />
                            <ClipboardCopy title={account.account_id} />
                        </Paper>
                    </Grid>
                    </React.Fragment>)
            })
            }</>

    );
}
