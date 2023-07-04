import { BrowserMainMenuFactory } from "@theia/core/lib/browser/menu/browser-menu-plugin";
import { ContainerModule, interfaces } from "@theia/core/shared/inversify";
import { OniroBrowserMainMenuFactory } from "./menus/main-menu";

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    rebind(BrowserMainMenuFactory).to(OniroBrowserMainMenuFactory).inSingletonScope();
});