import { nls } from "@theia/core";
import { KeybindingRegistry, PreferenceSchemaProvider, PreferenceService } from "@theia/core/lib/browser";
import { ContextKeyService } from "@theia/core/lib/browser/context-key-service";
import { Keybinding } from "@theia/core/lib/common/keybinding";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { OniroKeymapPreferences, ONIRO_KEYMAP_PREFERENCE_ID } from "./keymap-preferences";

export interface Keymap {
    id: string;
    label: string;
}
export const DEFAULT_KEYMAP: Keymap = {
    id: 'default',
    label: nls.localize('oniro/keymaps/default', 'Default')
}
export const KEYMAP_CONTEXT_KEY = 'oniro.keymap.key' 

@injectable()
export class KeymapService {

    keymaps: Keymap[] = [DEFAULT_KEYMAP];

    @inject(ContextKeyService) 
    private contextKeyService: ContextKeyService;

    @inject(PreferenceService) 
    private preferenceService: PreferenceService;

    @inject(PreferenceSchemaProvider)
    private schema: PreferenceSchemaProvider;

    @inject(OniroKeymapPreferences)
    private oniroKeymapPreferences: OniroKeymapPreferences

    @postConstruct()
    init() {
        this.contextKeyService.createKey(KEYMAP_CONTEXT_KEY, DEFAULT_KEYMAP.id);
        this.oniroKeymapPreferences.ready.then(() =>
            this.contextKeyService.setContext(KEYMAP_CONTEXT_KEY, this.oniroKeymapPreferences[ONIRO_KEYMAP_PREFERENCE_ID])
        );
        this.oniroKeymapPreferences.onPreferenceChanged(e => 
            this.contextKeyService.setContext(KEYMAP_CONTEXT_KEY, e.newValue)
        );
    }


    set currentKeymap(keymap: Keymap) {
        this.contextKeyService.setContext(KEYMAP_CONTEXT_KEY, keymap.id);
        this.preferenceService.set(ONIRO_KEYMAP_PREFERENCE_ID, keymap.id);
    }

    get currentKeymap(): Keymap {
        return this.keymaps.find(keymap => keymap.id === this.oniroKeymapPreferences[ONIRO_KEYMAP_PREFERENCE_ID]) ?? DEFAULT_KEYMAP
    }

    registerKeymap(keymap: Keymap, registry: KeybindingRegistry, ...keybindings: Keybinding[]) {
        this.keymaps.push(keymap);
        this.schema.updateSchemaProperty(ONIRO_KEYMAP_PREFERENCE_ID, {enum: this.keymaps.map(keymaps => keymap.id)})

        registry.registerKeybindings(...keybindings.map(
            binding => ({
                    ...binding,
                    when: binding.when ? `(${binding.when}) && ${KEYMAP_CONTEXT_KEY} == '${keymap.id}'` : `${KEYMAP_CONTEXT_KEY} == '${keymap.id}'`
                })
        ))
    }
}


