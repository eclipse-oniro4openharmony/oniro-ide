import { injectable } from "@theia/core/shared/inversify";
import { ElectronMainMenuFactory } from "@theia/core/lib/electron-browser/menu/electron-main-menu-factory";
import { fillMenuBar } from "../browser/menus/main-menu";

@injectable()
export class OniroElectronMainMenuFactory extends ElectronMainMenuFactory {
    protected override fillMenuBar = fillMenuBar
}