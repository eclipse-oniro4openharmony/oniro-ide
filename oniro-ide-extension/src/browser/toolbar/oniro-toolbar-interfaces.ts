import { OniroVerticalToolbarImpl } from "./oniro-vertical-toolbar";

export const OniroVerticalToolbar = Symbol('OniroVerticalToolbar');
export const OniroVerticalToolbarFactory = Symbol('OniroToolbarFactory');
export type OniroVerticalToolbar = OniroVerticalToolbarImpl;

export enum VerticalToolbarAlignment {
    TOP = 'top',
    BOTTOM = 'bottom'
}