import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import BankCard from './BankCard';
import ClipboardCopy from "./ClipboardCopy"
import * as React from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from '../Context/UserContext';
import { useContext } from "react";

export default function BankAccounts({ bankInfos, allAccounts }) {
    const { user } = useContext(UserContext);
    if (!user.LoggedIn) {
        return <Navigate to="/" replace />;
    }
    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            height:"100%",
} }>
            <Paper sx={{
                marginBottom: 2,
                display: 'flex',
                justifyContent: "left",
                alignItems: "center",
                width:"100%",
                height:"100%"
            }}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <Typography variant="h4">
                        My Bank accounts
                    </Typography>
                    <Typography variant="h7">
                        List of added bank accounts
                    </Typography>
                </div>
                
            </Paper>
            {allAccounts &&
            allAccounts.map((account, id) => {
                return (
                    <React.Fragment key={id}><Grid item xs={12} md={8} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: "center",
                                alignItems:"center",
                            }}
                        >
                            <BankCard bankInfos={bankInfos} account={account} showBalance={false} />
                            <ClipboardCopy title={account.account_id} />
                        </Paper>
                    </Grid>
                    </React.Fragment>)
            })
            }</Container>

    );
}
