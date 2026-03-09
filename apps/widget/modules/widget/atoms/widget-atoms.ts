import { atom } from "jotai";
import { WidgetScreen } from "../types";

// BASIC WIDGET STATE ATOMS
export const screenAtom = atom<WidgetScreen>("auth");