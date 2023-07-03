import { injectable } from "@theia/core/shared/inversify";
import { BrowserMainMenuFactory, MenuBarWidget } from "@theia/core/lib/browser/menu/browser-menu-plugin";
import { CompoundMenuNode, CompoundMenuNodeRole, MAIN_MENU_BAR } from "@theia/core";
import { codicon } from "@theia/core/lib/browser";

@injectable()
export class OniroMainMenuFactory extends BrowserMainMenuFactory {
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
