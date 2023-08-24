import React from "react";

import databaseDefault from "./databaseDefault";

const DatabaseContext = React.createContext(databaseDefault);
DatabaseContext.displayName = "DatabaseContext";

export default DatabaseContext;