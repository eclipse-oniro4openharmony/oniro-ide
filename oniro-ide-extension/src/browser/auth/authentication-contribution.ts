import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from "@theia/core";
import { CommonMenus } from "@theia/core/lib/browser";
import { inject, injectable } from "@theia/core/shared/inversify";
import { AuthService } from "./auth-service";

const LOGOUT_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.logout',
    label: 'Logout',
    category: 'Account'
});

@injectable()
export class AuthenticationContribution implements MenuContribution, CommandContribution {

    @inject(AuthService)
    private authService: AuthService;


    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(LOGOUT_COMMAND, {
            execute: () => this.authService.logout()
        });
    }


    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE, {commandId: LOGOUT_COMMAND.id, order: 'z'})
    }

}