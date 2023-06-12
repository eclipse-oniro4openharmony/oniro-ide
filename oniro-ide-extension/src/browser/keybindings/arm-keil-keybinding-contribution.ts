import { nls } from "@theia/core";
import { KeybindingContribution, KeybindingRegistry } from "@theia/core/lib/browser";
import { inject, injectable } from "@theia/core/shared/inversify";
import { Keymap, KeymapService } from "./keymap-service";

const ARM_KEIL_KEYMAP: Keymap = {
    id: 'arm-keil',
    label: nls.localize('oniro/keymaps/armKeil', 'ARM Keil')
}

@injectable()
export class ARMKeilKeybindingContribution implements KeybindingContribution {

    @inject(KeymapService) keymapService: KeymapService;

    registerKeybindings(keybindings: KeybindingRegistry): void {
        // TODO add rest of the keybindings
        // these keybindings are added after the defaults, so when activated these will be picked over the default keybindings
        this.keymapService.registerKeymap(ARM_KEIL_KEYMAP, keybindings, 
            {
                command: 'workspace:open',
                keybinding: 'Ctrl+O',
            },
            {
                command: 'editor.action.transformToUppercase',
                keybinding: 'Ctrl+U'
            },
            {
                command: 'editor.action.transformToLowercase',
                keybinding: 'Ctrl+Shift+U'
            });
    }

}

