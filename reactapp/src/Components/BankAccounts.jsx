import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import BankCard from './BankCard';
import * as React from "react";

export default function BankAccounts({ bankInfos, allAccounts }) {
   

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
                        </Paper>
                    </Grid>
                    </React.Fragment>)
            })
            }</>

    );
}
