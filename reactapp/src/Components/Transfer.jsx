// Integrate Dwolla with plaid for payments
import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Paper
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Transfer = ({ allAccounts, bankInfos }) => {
    const [accountTo, setAccountTo] = useState('');
    const [accountFrom, setAccountFrom] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            accountTo:atob(accountTo),
            accountFrom:accountFrom,
            amount,
        });
    };

    if (!allAccounts) {


        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                <CircularProgress />
            </div>
        );
    }
    return (
        <Container component="main" maxWidth="lg" >
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h5" sx={{padding:4} }>Transfer funds</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select account</InputLabel>
                                <Select
                                    value={accountFrom}
                                    label="Select account"
                                    onChange={(e) => setAccountFrom(e.target.value)}
                                >
                                    {allAccounts.map((account, id) => {
                                        return (<MenuItem key={id} value={account.account_id}>{bankInfos.filter(bank => bank.institution_id === account.institutionID)[0]?.name}: {account.name}</MenuItem>)
                                    }) }
                                </Select>
                                <FormHelperText>Choose bank account to transfer funds from</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <TextField
                                    value={accountTo}
                                    onChange={(e) => setAccountTo(e.target.value)}
                                    id="outlined-number"
                                    label="Receiver's account"
                                    type="text"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <FormHelperText>Input receiver's account ID</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                            <TextField
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                id="outlined-number"
                                label="Amount"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                />
                                <FormHelperText>Set amount to transfer</FormHelperText>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Transfer;