import { CommandContribution, MenuContribution } from "@theia/core";
import { KeybindingContribution, PreferenceContribution } from "@theia/core/lib/browser";
import { PreferenceProxyFactory } from "@theia/core/lib/browser/preferences/injectable-preference-proxy";
import { interfaces } from "@theia/core/shared/inversify";
import { ARMKeilKeybindingContribution } from "./arm-keil-keybinding-contribution";
import { KeymapContribution } from "./keymap-contribution";
import { KeymapService } from "./keymap-service";
import { OniroKeymapPreferenceContribution, OniroKeymapPreferences, OniroKeymapPreferencesSchema } from "./keymap-preferences"

export const bindOniroKeybindingsContribution = (bind: interfaces.Bind, rebind: interfaces.Rebind) => {
    bind(OniroKeymapPreferenceContribution).toConstantValue({ schema: OniroKeymapPreferencesSchema });
    bind(PreferenceContribution).toService(OniroKeymapPreferenceContribution);
    bind(OniroKeymapPreferences).toDynamicValue(ctx => {
        const factory = ctx.container.get<PreferenceProxyFactory>(PreferenceProxyFactory);
        return factory(OniroKeymapPreferencesSchema);
    }).inSingletonScope();


    bind(KeymapService).toSelf().inSingletonScope();
    
    bind(KeybindingContribution).to(ARMKeilKeybindingContribution);
    
    bind(CommandContribution).to(KeymapContribution);
    bind(MenuContribution).to(KeymapContribution);

}