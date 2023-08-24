import React from "react";

import queryParamsDefault from "./queryParamsDefault";

const QueryParamsContext = React.createContext(queryParamsDefault);
QueryParamsContext.displayName = "QueryParamsContext";

export default QueryParamsContext;