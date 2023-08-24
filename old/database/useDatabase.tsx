
import React from "react";
import DatabaseContext from "./DatabaseContext";
import { Database } from "./databaseStructure";


export default function useDatabase(): Database {
    return React.useContext(DatabaseContext);
};