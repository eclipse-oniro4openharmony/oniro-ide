import { Command, CommandContribution, CommandRegistry } from "@theia/core";
import { injectable } from "@theia/core/shared/inversify";

// project commands
export const NEW_PROJECT_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'new-project',
    label: 'New Project'
});

export const NEW_MULTI_WORKSPACE_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'new-multi-project-workspace',
    label: 'new Multi-Project Worksapce...'
});

export const OPEN_PROJECT_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'open-project',
    label: 'Open Project'
});

export const CLOSE_PROJECT_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'close-project',
    label: 'Close Project'
});

// build commands
export const CLEAN_TARGETS_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'clean-targets',
    label: 'Clean Targets'
});

export const BUILD_TARGET_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'build-target',
    label: 'Build Targets'
});

export const REBUILD_TARGET_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'rebuild-targets',
    label: 'Rebuild all target files'
});

export const BATCH_BUILD_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'batch-build',
    label: 'Batch build...'
});

export const STOP_BUILD_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'stop-build',
    label: 'Stop build'
});

// project config commands
export const SELECT_DEVICE_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'device-select',
    label: 'Select Device...'
});

export const REMOVE_ITEM_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'remove-project-item',
    label: 'Remove Item'
});

export const TARGET_OPTIONS_COMMAND = Command.toDefaultLocalizedCommand({
    id: 'target-options',
    label: 'Options...'
});

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
        commands.registerCommand(STOP_BUILD_COMMAND, {execute: () => {}});
    }

}