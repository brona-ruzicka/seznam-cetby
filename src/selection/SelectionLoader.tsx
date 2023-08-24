import React from "react";
import type { Reference } from "../database/dataStructure";
import type { Mutable } from "../typeutil";

import SelectionContext from "./SelectionContext";
import type { Item, SelectionOperators, Selection } from "./selectionStructure";
import CookieContext from "../cookie/CookieContext";
import useQueryParam from "../queryparams/useQueryParam";
import QueryParamsContext from "../queryparams/QueryParamsContext";


export default function SelectionLoader(props: {
    children: React.ReactNode
}) {

    const [ , setBlank ] = React.useState({});

    const queryParamsContext = React.useContext(QueryParamsContext);
    const cookieContext = React.useContext(CookieContext);
    
    React.useEffect(() => {
        const handle = { names: [ "s" ], notify: () => setBlank({}) };
        queryParamsContext.subscribe(handle);
        return () => queryParamsContext.unsubscribe(handle);
    }, [ queryParamsContext, setBlank ]);

    React.useEffect(() => {
        if (queryParamsContext.values["s"] !== null)
            return;

        const handle = { names: [ "selection" ], notify: () => setBlank({}) };
        cookieContext.subscribe(handle);
        return () => cookieContext.unsubscribe(handle);
    }, [ queryParamsContext.values["s"] === null, cookieContext, queryParamsContext, setBlank ]);


    const selectionString = queryParamsContext.values["s"] ?? cookieContext.values["selection"] ?? "";

    const setSelectionString = React.useCallback((val: string | ((prev: string) => string)) => {
        const isShared = queryParamsContext.values["s"] !== null;

        if  (typeof val === "function") {
            val = val(queryParamsContext.values["s"] ?? cookieContext.values["selection"] ?? "");
        }

        if (isShared) {
            queryParamsContext.update({ s: val });
        } else {
            cookieContext.update({ selection: val })
        }
    }, [ queryParamsContext, cookieContext ]);


    const selectionArray = React.useMemo(() => selectionString.split(".").map((i) => parseInt(i)).filter(Number.isInteger), [ selectionString ]);

    const updateSelection = React.useCallback((action: {
        type: "add" | "remove" | "toggle" | "set",
        items: ReadonlyArray<Item | Reference<Item>>
    } | {
        type: "clear",
    }) => setSelectionString((prev) => {
        const state = prev.split(".").map((i) => parseInt(i)).filter(Number.isInteger);
        
        if (action.type === "clear")
            return "";
        
        const items = action.items.map(item => typeof item === "object" ? item.id : item);

        switch (action.type) {
            case "set":
                return items.join(".");

            case "add":
                return [ ...state , ...items.filter(item => !state.includes(item)) ].join(".");

            case "remove":
                return state.filter(item => !items.includes(item)).join(".");

            case "toggle":
                return [ ...state.filter(item => !items.includes(item)) , ...items.filter(item => !state.includes(item)) ].join(".");
        }

    }), [ setSelectionString ]);


    const selectionOperators = React.useMemo(() => ({
        add:    (...items) => updateSelection({ type: "add",    items }),
        remove: (...items) => updateSelection({ type: "remove", items }),
        toggle: (...items) => updateSelection({ type: "toggle", items }),

        set:    (...items) => updateSelection({ type: "set",    items }),
        clear:  () => updateSelection({ type: "clear" })

    } as Partial<SelectionOperators>), [ updateSelection ]);


    const selection = React.useMemo(() => {

        const selection = [ ...selectionArray ] as Mutable<Partial<Selection>>;

        selection.add    = selectionOperators.add;
        selection.remove = selectionOperators.remove;
        selection.toggle = selectionOperators.toggle;    
        selection.set    = selectionOperators.set;
        selection.clear  = selectionOperators.clear;

        selection.includes = (...items) => items
            .map(item => typeof item === "object" ? item.id : item)
            .every(item => selectionArray.includes(item));

        return selection as Selection;

    }, [ selectionArray, selectionOperators ]);

    
    return (
        <SelectionContext.Provider value={selection}>
            {props.children}
        </SelectionContext.Provider>
    );

}