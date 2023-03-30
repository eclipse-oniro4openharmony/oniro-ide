import { injectable } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';

@injectable()
export class OniroIdeCommandContribution implements CommandContribution {
    registerCommands(registry: CommandRegistry): void {
    }
}

@injectable()
export class OniroIdeMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
    }
}
