import { Command, CommandContribution, CommandRegistry } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';
import { CommonCommands } from '@theia/core/lib/browser/common-frontend-contribution';
import { EditorCommands } from '@theia/editor/lib/browser';
import { WorkspaceCommands } from '@theia/workspace/lib/browser/workspace-commands';

@injectable()
export class OniroToolbarCommands implements CommandContribution {
    @inject(CommandRegistry) commandRegistry: CommandRegistry;
    registerCommands(registry: CommandRegistry): void {}
    
    getOniroCommands(): Command[] {
        const commands = Array.from(this.commandRegistry.getAllCommands());
        
        // Filter by category and filter out commands that don't have an icon nor a label
        const compileCommands = commands.filter(cmd => !!cmd.iconClass && !!cmd.label && cmd.category === 'Compile');
        const projectCommands = commands.filter(cmd => !!cmd.iconClass && !!cmd.label && cmd.category === 'Project');
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

        return [...projectCommands, ...fileCommands, ...compileCommands, ...debugCommands];
    }
}