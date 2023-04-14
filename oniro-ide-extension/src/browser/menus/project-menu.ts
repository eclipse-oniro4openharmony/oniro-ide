import { CompoundMenuNodeRole, MAIN_MENU_BAR, MenuContribution, MenuModelRegistry, nls } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";
import { BUILD_TARGET_COMMAND, CLEAN_TARGETS_COMMAND, TARGET_OPTIONS_COMMAND, REBUILD_TARGET_COMMAND, REMOVE_ITEM_COMMAND, SELECT_DEVICE_COMMAND, BATCH_BUILD_COMMAND, 
    CLOSE_PROJECT_COMMAND, NEW_MULTI_WORKSPACE_COMMAND, NEW_PROJECT_COMMAND, OPEN_PROJECT_COMMAND, STOP_BUILD_COMMAND, TRANSLATES_COMMAND } from "../commands/project-commands";


@injectable()
export class ProjectMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const subMenuPath = [...MAIN_MENU_BAR, 'project'];
        menus.registerSubmenu(subMenuPath, nls.localizeByDefault('Project'), {
            order: '4'
        });
        // basic project actions
        menus.registerMenuAction(subMenuPath, {
            commandId: NEW_PROJECT_COMMAND.id,
            order: '1'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: NEW_MULTI_WORKSPACE_COMMAND.id,
            order: '2'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: OPEN_PROJECT_COMMAND.id,
            order: '3'
        });
        menus.registerMenuAction(subMenuPath, {
            commandId: CLOSE_PROJECT_COMMAND.id,
            order: '4'
        });
        // export/manage
        // const exportSubmenuPath = [...subMenuPath, 'Export']
        // menus.registerSubmenu(exportSubmenuPath, 'Export', {role: CompoundMenuNodeRole.Group})
        // menus.registerMenuAction(exportSubmenuPath, {
        //     commandId: 'Export'
        // });
        // menus.registerMenuAction(exportSubmenuPath, {
        //     commandId: 'Manage'
        // });

        // project and targets confifg
        const targetsSubmenuPath = [...subMenuPath, 'Targets']
        menus.registerSubmenu(targetsSubmenuPath, 'Targets', {role: CompoundMenuNodeRole.Group, order: '5'})
        menus.registerMenuAction(targetsSubmenuPath, {
            commandId: SELECT_DEVICE_COMMAND.id,
            order: '1'
        });
        menus.registerMenuAction(targetsSubmenuPath, {
            commandId: REMOVE_ITEM_COMMAND.id,
            order: '2'
        });
        menus.registerMenuAction(targetsSubmenuPath, {
            commandId: TARGET_OPTIONS_COMMAND.id,
            order: '3'
        });

        // build
        const buildSubmenuPath = [...subMenuPath, 'Build']
        menus.registerSubmenu(buildSubmenuPath, 'Build', {role: CompoundMenuNodeRole.Group, order: '6'})
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: CLEAN_TARGETS_COMMAND.id,
            order: '1'
        });
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: BUILD_TARGET_COMMAND.id,
            order: '2'
        });
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: REBUILD_TARGET_COMMAND.id,
            order: '3'
        });
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: BATCH_BUILD_COMMAND.id,
            order: '4'
        });
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: TRANSLATES_COMMAND.id,
            order: '5'
        });
        menus.registerMenuAction(buildSubmenuPath, {
            commandId: STOP_BUILD_COMMAND.id,
            order: '6'
        });
    }

}