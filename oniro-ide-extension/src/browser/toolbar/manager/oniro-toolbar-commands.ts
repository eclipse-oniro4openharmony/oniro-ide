import { Command, CommandContribution, CommandRegistry } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { CommonCommands } from '@theia/core/lib/browser/common-frontend-contribution';
import { EditorCommands } from '@theia/editor/lib/browser';
import { WorkspaceCommands } from '@theia/workspace/lib/browser/workspace-commands';
import { BUILD_CATEGORY, PROJECT_CATEGORY } from '../../commands/project-commands';

@injectable()
export class OniroToolbarCommands implements CommandContribution {
    @inject(CommandRegistry) commandRegistry: CommandRegistry;
    
    registerCommands(registry: CommandRegistry): void {
        // define a command...
        const exampleCommand: Command = {
            id: 'example-command',
            label: 'Example Command',
            iconClass: 'fa fa-star',
            category: 'Example'
        };
        // ...and register it
        registry.registerCommand(exampleCommand, {
            // Let the execute method excute a command by id. 
            // In this case an id provided by a vscode extension packaged and installed from this here:
            // https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample
            execute: () => registry.executeCommand('notifications-sample.showInfo').catch((e: Error) => console.error(e.message))
        });
    }
    
    getOniroCommands(): Command[] {
        const commands = Array.from(this.commandRegistry.getAllCommands());
        
        // Filter by category and filter out commands that don't have an icon nor a label
        const compileCommands = commands.filter(cmd => !!cmd.iconClass && !!cmd.label && cmd.category === BUILD_CATEGORY);
        const projectCommands = commands.filter(cmd => !!cmd.iconClass && !!cmd.label && cmd.category === PROJECT_CATEGORY);
        const debugCommands = commands.filter(cmd => !!cmd.iconClass && !!cmd.label && cmd.category === 'Debug');
        
        // Pick out the single commands that we want to add to the toolbar, add an icon and a category
        const fileCommands: Command[] = [
            Object.assign(WorkspaceCommands.NEW_FILE, { iconClass: 'fa fa-file-o' }),
            Object.assign(CommonCommands.CUT, { iconClass: 'fa fa-cut' }),
            Object.assign(CommonCommands.COPY, { iconClass: 'fa fa-copy' }),
            Object.assign(CommonCommands.PASTE, { iconClass: 'fa fa-paste' }),
            Object.assign(CommonCommands.UNDO, { iconClass: 'codicon codicon-discard' }),
            Object.assign(CommonCommands.REDO, { iconClass: 'codicon codicon-redo' }),
            Object.assign(EditorCommands.GO_BACK, { iconClass: 'codicon codicon-arrow-left' }),
            Object.assign(EditorCommands.GO_FORWARD, { iconClass: 'codicon codicon-arrow-right' }),
        ].map(cmd => Object.assign(cmd, { category: 'File' }));

        // Pick commands by id and add it to the returned array 
        const otherCommands: Command[] = [];
        // Add the example command from above to the toolbar
        const exampleCommand = this.commandRegistry.getCommand('example-command');
        exampleCommand && otherCommands.push(exampleCommand);

        return [...projectCommands, ...fileCommands, ...compileCommands, ...debugCommands, ...otherCommands];
    }
}