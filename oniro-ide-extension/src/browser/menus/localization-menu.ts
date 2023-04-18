import { MenuContribution, MenuModelRegistry } from "@theia/core";
import { CommonMenus, CommonCommands } from '@theia/core/lib/browser';
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class LocalizationMenuContribution implements MenuContribution {
    registerMenus(registry: MenuModelRegistry): void {
        registry.registerMenuAction(CommonMenus.SETTINGS__THEME, {
            commandId: CommonCommands.CONFIGURE_DISPLAY_LANGUAGE.id,
            order: 'z'
        });
    }
}
