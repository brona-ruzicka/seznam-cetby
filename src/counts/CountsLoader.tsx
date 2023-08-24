import React from "react";

import useDatabase from "../database/useDatabase";
import useSelection from "../selection/useSelection";


import CountsContext from "./CountsContext";
import countsDefault from "./countsDefault";
import type { Counts } from "./countsStructure";


export default function DatabaseLoader(props: {
    children?: React.ReactNode | undefined,
}) {

    const database = useDatabase();
    const selection = useSelection();


    const counts = React.useMemo(() => {

        if (!database.loaded)
            return countsDefault;


        const total = selection.length;

        
        const authors = selection
            .map(id => (database.books[id].authors.map(author => author.id)))
            .reduce((reducer, ids) => {
                ids.forEach(id => reducer[id] = (reducer[id] | 0) + 1 );
                return reducer;
            }, {} as Record<number, number>);

        Object.values(database.authors)
            .forEach(author => authors[author.id] |= 0);


        const categories = selection
            .map(id => (database.books[id].categories.map(category => category.id)))
            .reduce((reducer, ids) => {
                ids.forEach(id => reducer[id] = (reducer[id] | 0) + 1 );
                return reducer;
            }, {} as Record<number, number>);

        Object.values(database.categories)
            .forEach(category => categories[category.id] |= 0);


        return {
            total,
            authors,
            categories,
        } as Counts;

    }, [ database, selection ]);


    return (
        <CountsContext.Provider value={counts}>
            {props.children}
        </CountsContext.Provider>
    );

}
