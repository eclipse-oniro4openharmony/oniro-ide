import { Command, CommandContribution, CommandRegistry } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { ToolbarCommands } from '@theia/toolbar/lib/browser/toolbar-constants';
import { ToolbarController } from '@theia/toolbar/lib/browser/toolbar-controller';
import { ToolbarItem } from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { OniroToolbarCommands } from './oniro-toolbar-commands';
import { OniroToolbarManagerDialog } from './oniro-toolbar-manager-dialog';
import { groupCommands } from './oniro-toolbar-utils';

@injectable()
export class OniroToolbarManagerContribution implements CommandContribution {
    @inject(ToolbarController) protected toolbarController: ToolbarController;
    @inject(CommandRegistry) protected commandRegistry: CommandRegistry;
    @inject(OniroToolbarCommands) protected oniroCommands: OniroToolbarCommands;

    protected oniroToolbarManagerDialog: OniroToolbarManagerDialog;

    registerCommands(registry: CommandRegistry): void {
        registry.unregisterCommand(ToolbarCommands.ADD_COMMAND_TO_TOOLBAR);
        registry.registerCommand(ToolbarCommands.ADD_COMMAND_TO_TOOLBAR, {
            execute: async () => {
                const selectedCommands = new Set(this.toolbarController.toolbarItems.items.left.map(item => item.map(i => i.id)).flat());
                this.oniroToolbarManagerDialog = new OniroToolbarManagerDialog(selectedCommands, await this.oniroCommands.getOniroCommands());
                const selectedCommandIds = await this.oniroToolbarManagerDialog.open();
                if(selectedCommandIds) {
                    const selectedCommands = Array.from(selectedCommandIds).map(cmdId => this.commandRegistry.getCommand(cmdId)).filter(cmd => !!cmd) as Command[];
                    const commandGroups = groupCommands(selectedCommands);
                    await this.toolbarController.clearAll();
                    const groups = Object.values(commandGroups);
                    const addToolbarTree = groups.map<ToolbarItem[]>(
                        group => group.map(
                            cmd => ({id: cmd.id, command: cmd.id, tooltip: cmd.label, icon: cmd.iconClass})
                        ));
                    this.toolbarController.toolbarItems.items.left.push(...addToolbarTree);
                    await this.toolbarController.openOrCreateJSONFile();
                    this.oniroToolbarManagerDialog.dispose(); 
                }
            }
        });
    }
    
}