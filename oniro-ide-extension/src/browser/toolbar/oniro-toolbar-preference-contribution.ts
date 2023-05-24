
import { PreferenceSchema, PreferenceProxy, PreferenceScope } from '@theia/core/lib/browser';

export const ONIRO_TOOLBAR_SIDE_ID = 'toolbar.oniro.side';

export const OniroToolbarPreferencesSchema: PreferenceSchema = {
    type: 'object',
    properties: {
        [ONIRO_TOOLBAR_SIDE_ID]: {
            'type': 'string',
            'description': 'Toolbar side',
            'default': 'top',
            'scope': PreferenceScope.Workspace,
        },
    },
};

export const OniroToolbarPreferencesContribution = Symbol('OniroToolbarPreferencesContribution');
export interface OniroToolbarPreferencesContribution {
    [ONIRO_TOOLBAR_SIDE_ID]: string;
}

export const OniroToolbarPreferences = Symbol('OniroToolbarPreferences');
export type OniroToolbarPreferences = PreferenceProxy<OniroToolbarPreferencesContribution>;