import React from 'react';
import { formatAmount } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import ImageListItem from '@mui/material/ImageListItem';
import ClipboardCopy from './ClipboardCopy';

const BankCard = ({ account, showBalance = true }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="#" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '1rem', backgroundColor: '#333', borderRadius: '8px', position: 'relative' }}>
                    <div>
                        <h1 style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                            {account.name}
                        </h1>
                        <p style={{ fontFamily: 'IBM Plex Serif', fontWeight: '900', color: 'white' }}>
                            {formatAmount(account.balances.current, account.iso_currency_code)}
                        </p>
                    </div>

                    <article style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1 style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                                {account.name}
                            </h1>
                            <h2 style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                                ●● / ●●
                            </h2>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1.1px', color: 'white' }}>
                            ●●●● ●●●● ●●●● <span style={{ fontSize: '16px' }}>{account?.mask}</span>
                        </p>
                    </article>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                    <ImageListItem>
                        <img
                            src="/icons/Paypass.svg"
                            alt="pay"
                            style={{ width: '20px', height: '24px' }}
                        />
                    </ImageListItem>
                    <ImageListItem style={{ marginLeft: '1.25rem' }}>
                        <img
                            src="/icons/mastercard.svg"
                            alt="mastercard"
                            style={{ width: '45px', height: '32px' }}
                        />
                    </ImageListItem>
                </div>

                <ImageListItem style={{ position: 'absolute', top: 0, left: 0 }}>
                    <img
                        src="/icons/lines.png"
                        alt="lines"
                        style={{ width: '316px', height: '190px' }}
                    />
                </ImageListItem>
            </Link>

             {showBalance && <ClipboardCopy title={account?.sharaebleId} />} 
        </div>
    );
};

export default BankCard;
