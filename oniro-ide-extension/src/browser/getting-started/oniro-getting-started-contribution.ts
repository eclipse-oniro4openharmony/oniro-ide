import { CommandRegistry } from "@theia/core";
import { FrontendApplication } from "@theia/core/lib/browser";
import { GettingStartedContribution, GettingStartedCommand } from '@theia/getting-started/lib/browser/getting-started-contribution'
import { injectable, inject } from 'inversify';


@injectable()
export class OniroGetingContribution extends GettingStartedContribution {

    @inject(CommandRegistry) commands: CommandRegistry;
    
    override async onStart(app: FrontendApplication): Promise<void> {
        // the deveco plugin opens its homepage itself when loaded.
        // so right now we don't want to open anything ourselves
        // this onStart method can be removed when switching over to the custom widget 
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(GettingStartedCommand, {execute: () => {
            if(commands.getCommand('DevEco.showHome')) {
                commands.executeCommand('DevEco.showHome');
            } else {
                this.openView({ reveal: true, activate: true })
            }
        }});
    }

}