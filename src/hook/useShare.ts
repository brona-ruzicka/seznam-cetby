import React from "react";
import useSelection from "../selection/useSelection";
import useGlobalStateModifier from "../globalstate/useGlobalStateModifier";
import { SelectionArray } from "../selection/selectionStructure";

export default function useShare() {

    const selection = useSelection();
    const modify = useGlobalStateModifier();

    const share = React.useCallback(() => {

        const url = new URL(window.location.href);
        url.search = `s=${selection.join(".")}`;

        if (window.navigator.userAgent && window.navigator.share && /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)) {
            window.navigator.share({
                url: url.toString(),
                title: "Můj seznam četby"
            });
        } else {
            modify({ share: "open" });
        }
    }, [ selection, modify ]);

    return share;

}

export const generateShareUrl = (selection: SelectionArray) => {
    
    const url = new URL(window.location.href);
    url.search = `s=${selection.join(".")}`;
    return url.toString();

}
