import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Title from './Title';
import { useEffect, useState, useMemo } from 'react';
import { formatAmount } from '../../utils/formatters';
import { CurrentActiveAccountContext } from "../../Context/UserContext"
import CircularProgress from '@mui/material/CircularProgress';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GppGoodIcon from '@mui/icons-material/GppGood';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
const data = [
    { id: 0, value: 40, label: 'Food',color:"orange" },
    { id: 1, value: 15, label: 'Housing', color:"brown"},
    { id: 2, value: 10, label: 'Utilities', color:"yellow" },
    { id: 3, value: 20, label: 'Transportation', color:"blue" },
    { id: 4, value: 5, label: 'Insurance', color:"green" },
    { id: 5, value: 5, label: 'Medical & Healthcare', color:"red" },

];
const iconMap = {
    Food: <RestaurantIcon />,
    Housing: <HomeIcon />,
    Utilities: <ElectricBoltIcon />,
    Transportation: <DirectionsCarIcon />,
    Insurance: <GppGoodIcon />,
    'Medical & Healthcare': <MedicalServicesIcon/>,
};

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
   
    const renderLabel = (entry) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 8 }}>{iconMap[entry.label]}</span>
                {entry.label}
            </div>
        );
    };
  return (
    <React.Fragment>
          <Title>Total expenditure: {formatAmount(totalExpenditure, activeAccount && activeAccount.balances ? activeAccount.balances.iso_currency_code : "USD")}</Title>
          <div style={{ width: '100%', height: "100%", overflow: 'hidden', display: "flex", justifyContent: "center", alignItems:"center" }}>
              <PieChart
                  series={[
                      {
                          data: data,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                          paddingAngle: 5,
                          innerRadius: 20,
                          outerRadius: 100,
                      },
                  ]}
                  
                  height={200}
              />
      </div>
    </React.Fragment>
  );
}
