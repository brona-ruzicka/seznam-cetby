import React from "react";

import SelectionContext from "./SelectionContext";
import { EMPTY_SELECTION_LIST, SelectionObject } from "./selectionStructure";



export default function SelectionLoader(props: {
    children? : React.ReactNode | undefined,
}) {
    const [ selectionList, setSelectionList ] = React.useState(EMPTY_SELECTION_LIST);

    const selectionObject: SelectionObject = {
        get: () => selectionList,
        replace: list => setSelectionList(list),

        add: item => {
            if (selectionList.includes(item))
                return;
            
            setSelectionList([ ...selectionList, item ]);
        },
        remove: item => {
            const index = selectionList.indexOf(item);

            if (index == -1)
                return;

            const list = [ ...selectionList ];
            list.splice(index, 1);
            setSelectionList(list);
        },
        toggle: item => {
            const index = selectionList.indexOf(item);

            if (index == -1) {
                setSelectionList([ ...selectionList, item ]);
            } else {
                const list = [ ...selectionList ];
                list.splice(index, 1);
                setSelectionList(list);
            }

        },
        set: (item, value) => {

            const index = selectionList.indexOf(item);

            if (value && index == -1) {
                setSelectionList([ ...selectionList, item ]);
            } else if (value && index !== -1) {
                const list = [ ...selectionList ];
                list.splice(index, 1);
                setSelectionList(list);
            }
        },

        includes: item => selectionList.includes(item)
    };

    return (
        <SelectionContext.Provider
            value={ selectionObject }
        >
            { props.children }
        </SelectionContext.Provider>
    );

};