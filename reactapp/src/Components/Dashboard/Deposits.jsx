import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { CurrentActiveAccountContext } from "../../Context/UserContext"
import CountUp from "react-countup"
import { formatAmount } from '../../utils/formatters';
import CircularProgress from '@mui/material/CircularProgress';
import BankCard from '../BankCard';


export default function Deposits({ bankInfos }) {
    const { activeAccount } = React.useContext(CurrentActiveAccountContext);
    if (!activeAccount.account_id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100%"}}>
                <CircularProgress /> 
            </div>
        );
    }
    return (
        <React.Fragment>
            <Title>Account name</Title>
            <Typography component="p" variant="h4">
                {activeAccount.account_id ? activeAccount.name : ""}
            </Typography>
            <Title>Account Balance</Title>
            <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
                <Typography component="p" variant="h4">
                    <CountUp duration={2} end={activeAccount && activeAccount.balances ? activeAccount.balances.current : 0} suffix={activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : ""} formattingFn={(number) => formatAmount(number, activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : "USD")} />
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 , paddingLeft:10}}>
                    {new Date().toDateString("yyyy-MM-dd")}
                </Typography>
            </div>
            <BankCard bankInfos={bankInfos} account={activeAccount} showBalance={false}  />
        
        </React.Fragment>
    );
}
