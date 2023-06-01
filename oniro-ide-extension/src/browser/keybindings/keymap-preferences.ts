import { PreferenceProxy, PreferenceSchema, PreferenceScope } from "@theia/core/lib/browser";

export const ONIRO_KEYMAP_PREFERENCE_ID = 'keyboard.oniro.keymap';
export const OniroKeymapPreferenceContribution = Symbol('OniroKeymapPreferenceContribution')
export const OniroKeymapPreferencesSchema: PreferenceSchema = {
    type: 'object',
    properties: {
        [ONIRO_KEYMAP_PREFERENCE_ID]: {
            type: 'string',
            description: 'Keymap',
            default: 'Default',
            scope: PreferenceScope.Workspace,
        },
    },
};

export interface OniroKeymapPreferencesContribution {
    [ONIRO_KEYMAP_PREFERENCE_ID]: string;
}

export const OniroKeymapPreferences = Symbol('OniroKeymapPreferences');
export type OniroKeymapPreferences = PreferenceProxy<OniroKeymapPreferencesContribution>;