import React from 'react';
import Box from '@mui/material/Box';

const RoundLogo = ({ src, alt, size = 40 }) => {
    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:2
            }}
        >
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: 'auto',
                }}
            />
        </Box>
    );
};

export default RoundLogo;
