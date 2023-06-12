import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, QuickPickService } from "@theia/core";
import { CommonMenus } from "@theia/core/lib/browser";
import { inject, injectable } from "@theia/core/shared/inversify";
import { KeymapService } from "./keymap-service";


const CHANGE_KEYMAP_COMMAND: Command = Command.toLocalizedCommand({
    id: 'oniro.keybindings.changeKeymap',
    label: 'Change Keymap',
    category: 'Keybindings'
}, 'oniro/keybindng/changeKeymap')

@injectable()
export class KeymapContribution implements MenuContribution, CommandContribution {

    @inject(QuickPickService) 
    private quickPick: QuickPickService

    @inject(KeymapService) 
    private keymapService: KeymapService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(CHANGE_KEYMAP_COMMAND,
            {
                execute: async (keymapId?: string) => {
                    let keymap;
                    if(keymapId) {
                        keymap = this.keymapService.keymaps.find(keymap => keymap.id === keymapId);
                    } else {
                        keymap = await this.quickPick.show(this.keymapService.keymaps, {activeItem: this.keymapService.currentKeymap});
                    }

                    if(keymap) {
                       this.keymapService.currentKeymap = keymap;
                    }
                }
            })
    }


    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE_SETTINGS_SUBMENU_OPEN, {
            commandId: CHANGE_KEYMAP_COMMAND.id,
            label: CHANGE_KEYMAP_COMMAND.label
        })
    }

} 


