import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Title from './Title';
import { useEffect, useState, useMemo } from 'react';
import { formatAmount } from '../../utils/formatters';
import { CurrentActiveAccountContext } from "../../Context/UserContext"
import CircularProgress from '@mui/material/CircularProgress';


const data = [
    { id: 0, value: 40, label: 'Food' },
    { id: 1, value: 15, label: 'Housing' },
    { id: 2, value: 10, label: 'Utilities' },
    { id: 3, value: 20, label: 'Transportation' },
    { id: 4, value: 5, label: 'Insurance' },
    { id: 5, value: 5, label: 'Medical & Healthcare' },

];
export default function Chart({ transactions }) {
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const { activeAccount } = React.useContext(CurrentActiveAccountContext);
    
    const total = useMemo(() => {
        if (!transactions) return 0;
        var sum = 0
        transactions.filter(transaction => {
            let amount = transaction.amount
            if (amount < 0) {
                sum += amount;
            }
        });
        return sum;
    }, [transactions]);

    useEffect(() => {
        setTotalExpenditure(total);
    }, [total]);
    if (!activeAccount.account_id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100%" }}>
                <CircularProgress />
            </div>
        );
    }
  return (
    <React.Fragment>
          <Title>Total expenditure: {formatAmount(totalExpenditure, activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : "USD")}</Title>
          <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
              <PieChart
                  series={[
                      {
                          data: data,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                  ]}
                  height={200}
              />
      </div>
    </React.Fragment>
  );
}
