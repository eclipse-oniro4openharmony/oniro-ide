import { injectable } from "@theia/core/shared/inversify";
import { BrowserMainMenuFactory, DynamicMenuBarWidget, MenuBarWidget } from "@theia/core/lib/browser/menu/browser-menu-plugin";
import { CompoundMenuNode, CompoundMenuNodeRole, MAIN_MENU_BAR, nls } from "@theia/core";
import { codicon } from "@theia/core/lib/browser";

@injectable()
export class OniroMainMenuFactory extends BrowserMainMenuFactory {

    protected showMenuBar(menuBar: DynamicMenuBarWidget, preference: string | undefined): void {
        if (preference && ['classic', 'visible'].includes(preference)) {
            menuBar.clearMenus();
            this.fillMenuBar(menuBar);
        } else {
            menuBar.clearMenus();
        }
    }

    protected fillMenuBar(menuBar: MenuBarWidget): void {
        const menuModel = this.menuProvider.getMenu(MAIN_MENU_BAR);
        const menuCommandRegistry = this.createMenuCommandRegistry(menuModel);
        const virtualNode: CompoundMenuNode = {
            children: menuModel.children,
            id: 'virtualNode',
            role: CompoundMenuNodeRole.Submenu,
            sortString: '0',
            icon: codicon('menu'),
            isSubmenu: true
        };
        const menuWidget = this.createMenuWidget(virtualNode, { commands: menuCommandRegistry, rootMenuPath: MAIN_MENU_BAR });
        menuBar.addMenu(menuWidget);
    }
}
