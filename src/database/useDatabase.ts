
import React from "react";

import DatabaseContext from "./DatabaseContext";


export default function useDatabase() {

    return React.useContext(DatabaseContext);

}