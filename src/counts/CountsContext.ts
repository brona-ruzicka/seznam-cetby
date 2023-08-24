import React from "react";

import countsDefault from "./countsDefault";

const CountsContext = React.createContext(countsDefault);
CountsContext.displayName = "CountsContext";

export default CountsContext;