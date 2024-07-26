import React from 'react';
import { formatAmount } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import ClipboardCopy from './ClipboardCopy';
import CircularProgress from '@mui/material/CircularProgress';
import Lines from '../assets/lines.png';
import MasterCard from '../assets/mastercard.svg';
import Paypass from '../assets/Paypass.svg';


const BankCard = ({ account, showBalance = true }) => {
    if (!account.account) {
        console.log(account)
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        );
    }
    const cardStyle = {
        position: 'relative',
        display: 'flex',
        height: '190px',
        width: '100%',
        maxWidth: '320px',
        justifyContent: 'space-between',
        borderRadius: '20px',
        border: '1px solid white',
        background: "linear-gradient(90deg, #0179FE 0%, #4893FF 100%)", // Card background color
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(6px)',
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTopLeftRadius: '20px',
        borderBottomLeftRadius: '20px',
        background: "#0179FE", // Card content background color
        padding: '20px 20px 16px 20px',
        maxWidth: '228px',
    };

    const iconStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderTopRightRadius: '20px',
        borderBottomRightRadius: '20px',
        padding: '20px 20px',
        backgroundSize: 'cover',
    };

    const imageStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '316px',
        height: '190px',
        objectFit: 'cover',
        zIndex: 0,
    };

    const textStyle = {
        color: 'white',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="#" style={cardStyle}>
                <div style={contentStyle}>
                    <div>
                        <h1 style={{ ...textStyle, fontSize: '16px', fontWeight: '600' }}>
                            {account?.account.name}
                        </h1>
                        <p style={{ ...textStyle, fontFamily: 'IBM Plex Serif', fontWeight: '900' }}>
                            {formatAmount(account?.account.balances.current, account?.account.iso_currency_code || "USD")}
                        </p>
                    </div>

                    <article style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1 style={{ ...textStyle, fontSize: '12px', fontWeight: '600' }}>
                                {account?.account.name}

                            </h1>
                            <h2 style={{ ...textStyle, fontSize: '12px', fontWeight: '600' }}>
                                ●● / ●●
                            </h2>
                        </div>
                        <p style={{ ...textStyle, fontSize: '14px', fontWeight: '600', letterSpacing: '1.1px' }}>
                            ●●●● ●●●● ●●●● <span style={{ fontSize: '16px' }}>{account?.account.mask}</span>
                        </p>
                    </article>
                </div>

                <div style={iconStyle}>
                    <img
                        src={Paypass}
                        width={20}
                        height={24}
                        alt="pay"
                    />
                    <img
                        src={MasterCard}
                        width={45}
                        height={32}
                        alt="mastercard"
                        style={{ marginLeft: '5px' }}
                    />
                </div>

                <img
                    src={Lines}
                    width={316}
                    height={190}
                    alt="lines"
                    style={imageStyle}
                />
            </Link>

            {showBalance && <ClipboardCopy title={account?.account.account_id} />} 

        </div>
    );
};
    

export default BankCard;
