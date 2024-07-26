import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import BankCard from './BankCard';
import * as React from "react";
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

export default function BankAccounts({ allAccounts }) {
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
                {allAccounts.map((account, id) => {
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
                            <BankCard account={account} />
                        </Paper>
                    </Grid>
                    </React.Fragment>)
                })}
            </Grid>

            </Container>
        </Box>
    );
}
