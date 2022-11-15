import React, { useState } from "react";
import AboutContext from "./AboutContext";

const AboutContextState = (props) => {

    const [state, setState] = useState({ welcome: "HELLO WORLD!" });

    return (
        <AboutContext.Provider value={{ state, setState }}>
            {props.children}
        </AboutContext.Provider>
    );
};

export default AboutContextState;