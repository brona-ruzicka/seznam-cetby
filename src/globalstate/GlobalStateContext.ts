import React from "react";

import globalStateDefault from "./globalStateDefault";

const GlobalStateContext = React.createContext(globalStateDefault);
GlobalStateContext.displayName = "GlobalStateContext";

export default GlobalStateContext;