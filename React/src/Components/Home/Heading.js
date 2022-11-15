import React, { useContext } from 'react';
import HomeContext from '../../Context/HomeContext/HomeContext';

const Heading = () => {
    const { state } = useContext(HomeContext);
    return (
        <div>
            <h1>LMM (Lead Management Module)</h1>
            <p>{state.welcome}</p>
        </div>
    );
};

export default Heading;