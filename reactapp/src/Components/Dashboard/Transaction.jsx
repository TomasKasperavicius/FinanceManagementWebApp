import * as React from 'react';
import Chip from '@mui/material/Chip';
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
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate } from "react-router-dom";
import { UserContext } from '../../Context/UserContext';

const payment_channels = {
    0: "Online",
    1: "In store",
    2: "Other"
}
export default function Transaction({ transactions, showAllFields = false }) {
    const [visibleTransactions, setVisibleTransactions] = React.useState([])
    const { activeAccount } = React.useContext(CurrentActiveAccountContext);
    const { user } = React.useContext(UserContext);
    useEffect(() => {
        if (!activeAccount.account_id) return
        var filteredTransactions = transactions.filter(transaction => transaction.account_id === activeAccount.account_id);
        var sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setVisibleTransactions([...sortedTransactions])
    }, [transactions, activeAccount])
    if (!user.LoggedIn) {
        return <Navigate to="/login" replace />;
    }
    if (!activeAccount.account_id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                <CircularProgress />
            </div>
        );
    }
    const TableCellsAll = () => {
        return (<><TableCell>Name</TableCell><TableCell>Date</TableCell><TableCell>Sender</TableCell><TableCell>Receiver</TableCell><TableCell>Status</TableCell><TableCell>Amount</TableCell><TableCell>Channel</TableCell><TableCell>Details</TableCell></>)
    }
    const TableCellsDataAll = ({ transaction }) => {
        return (<><TableCell>{transaction.name}</TableCell><TableCell>{transaction.date}</TableCell><TableCell>{transaction.account_id}</TableCell><TableCell>{transaction.merchant_name ? (<div style={{ display: "flex", justifyContent: "left", alignItems: "center" }}>{transaction.merchant_name}<RoundLogo src={transaction.logo_url} /></div>) : transaction.name}</TableCell><TableCell>{transaction.pending ? <Chip label="Pending" color="yellow" variant="outlined" /> : <Chip label="Success" color="success" variant="outlined" />}</TableCell><TableCell>{formatAmount(transaction.amount, transaction.iso_currency_code)}</TableCell><TableCell>{payment_channels[transaction.payment_channel]}</TableCell><TableCell>{transaction.category[0]}</TableCell></>)
    }

    const TableCells = () => {
        return (
            <><TableCell>Name</TableCell><TableCell>Date</TableCell><TableCell>Status</TableCell><TableCell>Amount</TableCell></>
        )
    }
    const TableCellsData = ({ transaction }) => {
        return (<><TableCell>{transaction.name}</TableCell><TableCell>{transaction.date}</TableCell><TableCell>{transaction.pending ? <Chip label="Pending" color="yellow" variant="outlined" /> : <Chip label="Success" color="success" variant="outlined" />}</TableCell><TableCell>{formatAmount(transaction.amount, transaction.iso_currency_code)}</TableCell></>)
    }
    return (
        <React.Fragment>
            <Title>Recent transactions</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {showAllFields ? <TableCellsAll /> : <TableCells />}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleTransactions.map((transaction, id) => (
                        <TableRow key={id}>
                            {showAllFields ? <TableCellsDataAll transaction={transaction} /> : <TableCellsData transaction={transaction} />}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}
