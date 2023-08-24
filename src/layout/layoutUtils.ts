import { FragmentData, LayoutData } from "./layoutStructure";


export const exportSpecialFragments = <T extends string>(data: LayoutData, tags: T[]) => {

    const special = {} as Record<T, FragmentData>;
    const rest = [] as FragmentData[];

    data.forEach(fragment => {
        const tag = fragment.tag;
        if (tags.includes(tag as T)) {
            special[tag as T] = fragment;
        } else {
            rest.push(fragment);
        }
    })


    return {
        special,
        rest
    }

}