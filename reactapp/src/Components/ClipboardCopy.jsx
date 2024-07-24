import { useState } from "react";
import Button from '@mui/material/Button';


const Copy = ({ title }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(title);
        setHasCopied(true);

        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    return (
        <Button
            data-state="closed"
            style={{
                marginTop: '0.75rem',
                display: 'flex',
                maxWidth: '320px',
                gap: '1rem',
            }}
            variant="secondary"
            onClick={copyToClipboard}
        >
            <p style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                width: '100%',
                maxWidth: '100%',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#262626',
            }}>
                {title} test
            </p>

            {!hasCopied ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4"
                >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            )}
        </Button>
    );
};

export default Copy;