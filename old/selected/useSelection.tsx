import React from "react";
import SelectionContext from "./SelectionContext";
import { SelectionObject } from "./selectionStructure";

export default function useSelection(): SelectionObject {
    return React.useContext(SelectionContext);
}