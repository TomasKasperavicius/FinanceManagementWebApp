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
const Transfer = () => {
    const [accountTo, setAccountTo] = useState('');
    const [accountFrom, setAccountFrom] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({
            accountTo,
            accountFrom,
            amount,
        });
    };
    return (
        <Container component="main" maxWidth="xs" >
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h5" sx={{padding:4} }>Transfer funds</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select account</InputLabel>
                                <Select
                                    value={accountFrom}
                                    onChange={(e) => setAccountFrom(e.target.value)}
                                >
                                    <MenuItem value="checking">Checking</MenuItem>
                                    <MenuItem value="savings">Savings</MenuItem>
                                </Select>
                                <FormHelperText>Choose bank account to transfer funds from</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Receiver's plaid account ID</InputLabel>
                                <Select
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                >
                                    <MenuItem value="credit">Credit</MenuItem>
                                    <MenuItem value="debit">Debit</MenuItem>
                                </Select>
                                <FormHelperText>Set amount</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Account To"
                                value={accountTo}
                                onChange={(e) => setAccountTo(e.target.value)}
                                required
                            />
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