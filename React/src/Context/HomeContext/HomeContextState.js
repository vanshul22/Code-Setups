import React, { useState } from "react";
import HomeContext from "./HomeContext";

const HomeContextState = (props) => {

    const [state, setState] = useState({ welcome: "HELLO WORLD!" });

    return (
        <HomeContext.Provider value={{ state, setState }}>
            {props.children}
        </HomeContext.Provider>
    );
};

export default HomeContextState;