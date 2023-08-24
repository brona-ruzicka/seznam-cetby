import React from "react";

import CountsContext from "./CountsContext";


export default function useCounts() {

    return React.useContext(CountsContext);

}