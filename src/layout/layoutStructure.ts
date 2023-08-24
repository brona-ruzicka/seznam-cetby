
import React from "react";

type FragmentData = {
    tag: string,
    label: string,
    component: React.ReactNode
}

type LayoutData = FragmentData[];

export type {
    LayoutData,
    FragmentData,
}