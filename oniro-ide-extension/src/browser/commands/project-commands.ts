import { Command, CommandContribution, CommandRegistry } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";

const PROJECT_CATEGORY = 'Project';
const PROJECT_CATEGORY_KEY = 'oniro/projectMenu/project';
// project commands
export const NEW_PROJECT_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.new-project',
    label: 'New Project',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/newProject', PROJECT_CATEGORY_KEY);

export const NEW_MULTI_WORKSPACE_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.new-multi-project-workspace',
    label: 'new Multi-Project Worksapce...',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/newMultiProjectWorkspace', PROJECT_CATEGORY_KEY);

export const OPEN_PROJECT_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.open-project',
    label: 'Open Project',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/openProject', PROJECT_CATEGORY_KEY);

export const CLOSE_PROJECT_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.close-project',
    label: 'Close Project',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/closeProject', PROJECT_CATEGORY_KEY);

// build commands
export const CLEAN_TARGETS_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.clean-targets',
    label: 'Clean Targets',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/cleanTargets', PROJECT_CATEGORY_KEY);

export const BUILD_TARGET_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.build-target',
    label: 'Build Targets',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/buildTargets', PROJECT_CATEGORY_KEY);

export const REBUILD_TARGET_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.rebuild-targets',
    label: 'Rebuild all target files',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/rebuildTargets', PROJECT_CATEGORY_KEY);

export const BATCH_BUILD_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.batch-build',
    label: 'Batch build...',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/batchBuild', PROJECT_CATEGORY_KEY);

export const TRANSLATE_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.translate-project',
    label: 'Translate...',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/translate', PROJECT_CATEGORY_KEY);

export const STOP_BUILD_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.stop-build',
    label: 'Stop build',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/stopBuild', PROJECT_CATEGORY_KEY);

// project config commands
export const SELECT_DEVICE_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.device-select',
    label: 'Select Device...',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/selectDevice', PROJECT_CATEGORY_KEY);

export const REMOVE_ITEM_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.remove-project-item',
    label: 'Remove Item',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/removeItem', PROJECT_CATEGORY_KEY);

export const TARGET_OPTIONS_COMMAND = Command.toLocalizedCommand({
    id: 'oniro.target-options',
    label: 'Options...',
    category: PROJECT_CATEGORY
}, 'oniro/projectMenu/targetOptions', PROJECT_CATEGORY_KEY);

@injectable()
export class ProjectCommandContribution implements CommandContribution {
    registerCommands(commands: CommandRegistry): void {
        // general project commands
        commands.registerCommand(NEW_PROJECT_COMMAND, {execute: () => {}});
        commands.registerCommand(NEW_MULTI_WORKSPACE_COMMAND, {execute: () => {}});
        commands.registerCommand(OPEN_PROJECT_COMMAND, {execute: () => {}});
        commands.registerCommand(CLOSE_PROJECT_COMMAND, {execute: () => {}});
        // project config commands
        commands.registerCommand(SELECT_DEVICE_COMMAND, {execute: () => {}});
        commands.registerCommand(REMOVE_ITEM_COMMAND, {execute: () => {}});
        commands.registerCommand(TARGET_OPTIONS_COMMAND, {execute: () => {}});
        // build commands
        commands.registerCommand(CLEAN_TARGETS_COMMAND, {execute: () => {}});
        commands.registerCommand(BUILD_TARGET_COMMAND, {execute: () => {}});
        commands.registerCommand(REBUILD_TARGET_COMMAND, {execute: () => {}});
        commands.registerCommand(BATCH_BUILD_COMMAND, {execute: () => {}});
        commands.registerCommand(TRANSLATE_COMMAND, {execute: () => {}});
        commands.registerCommand(STOP_BUILD_COMMAND, {execute: () => {}});
    }

}