import { ElectronMainMenuFactory } from "@theia/core/lib/electron-browser/menu/electron-main-menu-factory";
import { ContainerModule, interfaces } from "@theia/core/shared/inversify";
import { OniroElectronMainMenuFactory } from "./menus/main-menu";

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    rebind(ElectronMainMenuFactory).to(OniroElectronMainMenuFactory).inSingletonScope();
});