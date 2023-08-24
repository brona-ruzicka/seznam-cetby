import React from "react";

import cookieDefault from "./cookieDefault";

const CookieContext = React.createContext(cookieDefault);
CookieContext.displayName = "CookieContext";

export default CookieContext;