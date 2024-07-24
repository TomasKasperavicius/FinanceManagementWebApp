import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { CurrentActiveAccountContext } from "../../Context/UserContext"
import CountUp from "react-countup"
import { formatAmount } from '../../utils/formatters';
import CircularProgress from '@mui/material/CircularProgress';

export default function Deposits() {
    const { activeAccount } = React.useContext(CurrentActiveAccountContext);
    if (!activeAccount) {
        // Display loading indicator while activeAccount is undefined
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress /> 
            </div>
        );
    }
    return (
        <React.Fragment>
            <Title>Account name</Title>
            <Typography component="p" variant="h4">
                {activeAccount ? activeAccount.name : ""}
            </Typography>
            <Title>Account Balance</Title>
            <Typography component="p" variant="h4">
                <CountUp duration={2} end={activeAccount && activeAccount.balances ? activeAccount.balances.current : 0} suffix={activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : ""} formattingFn={(number) => formatAmount(number, activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : "USD")} />
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                {new Date().toDateString("yyyy-MM-dd")}
            </Typography>
            <div>
                <Link color="primary" href="#">
                    View account details
                </Link>
            </div>
        </React.Fragment>
    );
}
