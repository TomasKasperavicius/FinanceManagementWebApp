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
    if (!activeAccount.account) {
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
                {activeAccount.account ? activeAccount.account.name : ""}
            </Typography>
            <Title>Account Balance</Title>
            <div style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
                <Typography component="p" variant="h4">
                    <CountUp duration={2} end={activeAccount.account && activeAccount.account.balances ? activeAccount.account.balances.current : 0} suffix={activeAccount.account && activeAccount.account.balances ? activeAccount.account.balances.iso_currency_code : ""} formattingFn={(number) => formatAmount(number, activeAccount.account && activeAccount.account.balances ? activeAccount.account.balances.iso_currency_code : "USD")} />
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 , paddingLeft:10}}>
                    {new Date().toDateString("yyyy-MM-dd")}
                </Typography>
            </div>
            <BankCard bankInfos={bankInfos} account={activeAccount} showBalance={false}  />
        
        </React.Fragment>
    );
}
