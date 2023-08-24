import React from "react";

import AutoCollapseContext from "./AutoCollapseContext";


export default function useAutoCollapse() {

    return React.useContext(AutoCollapseContext);

}