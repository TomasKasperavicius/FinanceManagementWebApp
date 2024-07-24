import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import RoundLogo from "../RoundLogo";
import { useEffect } from 'react';
import { CurrentActiveAccountContext } from "../../Context/UserContext"
import { formatAmount } from '../../utils/formatters';


export default function Transaction({ transactions }) {
    const [visibleTransactions, setVisibleTransactions] = React.useState([])
    const { activeAccount } = React.useContext(CurrentActiveAccountContext);
    useEffect(() => {
        var filteredTransactions = transactions.filter(transaction => transaction.account_id === activeAccount.account_id);
        var sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setVisibleTransactions([...sortedTransactions])
        console.log(visibleTransactions)
    }, [transactions, activeAccount])
    return (
        <React.Fragment>
            <Title>Recent transactions</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Sender</TableCell>
                        <TableCell>Receiver</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleTransactions.map((transaction, id) => (
                        <TableRow key={id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.account_id}</TableCell>
                            <TableCell>{transaction.merchant_name ? (<div style={{ display: "flex", justifyContent: "left", alignItems:"center"}}>{transaction.merchant_name}<RoundLogo src={transaction.logo_url} /></div>) : transaction.name}</TableCell>
                            <TableCell>{formatAmount(transaction.amount, transaction.iso_currency_code)}</TableCell>
                            <TableCell>{ transaction.category[0]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" sx={{ mt: 3 }}>
                See more orders
            </Link>
        </React.Fragment>
    );
}
