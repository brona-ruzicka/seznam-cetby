
import React from "react";

import SelectionContext from "./SelectionContext";


export default function useSelection() {

    return React.useContext(SelectionContext);

}