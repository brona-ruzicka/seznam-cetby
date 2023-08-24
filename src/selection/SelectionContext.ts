import React from "react";

import selectionDefault from "./selectionDefault";

const SelectionContext = React.createContext(selectionDefault);
SelectionContext.displayName = "SelectionContext";

export default SelectionContext;