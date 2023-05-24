import * as React from '@theia/core/shared/react';
import { KeybindingRegistry, PreferenceService, WidgetManager } from '@theia/core/lib/browser';
import { LabelIcon } from '@theia/core/lib/browser/label-parser';
import { TabBarToolbar, TabBarToolbarFactory, TabBarToolbarItem } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import { ProgressService } from '@theia/core';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { ProgressBarFactory } from '@theia/core/lib/browser/progress-bar-factory';
import { Deferred } from '@theia/core/lib/common/promise-util';
import {
    ToolbarItem,
    ToolbarAlignment,
    ToolbarItemPosition,
} from '@theia/toolbar/lib/browser/toolbar-interfaces';
import { OniroVerticalToolbarController } from './oniro-vertical-toolbar-controller';

export const TOOLBAR_PROGRESSBAR_ID = 'main-toolbar-progress';
@injectable()
export class OniroVerticalToolbarImpl extends TabBarToolbar {
    @inject(TabBarToolbarFactory) protected readonly tabbarToolbarFactory: TabBarToolbarFactory;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;
    @inject(FrontendApplicationStateService) protected readonly appState: FrontendApplicationStateService;
    @inject(OniroVerticalToolbarController) protected readonly model: OniroVerticalToolbarController;
    @inject(PreferenceService) protected readonly preferenceService: PreferenceService;
    @inject(KeybindingRegistry) protected readonly keybindingRegistry: KeybindingRegistry;
    @inject(ProgressBarFactory) protected readonly progressFactory: ProgressBarFactory;
    @inject(ProgressService) protected readonly progressService: ProgressService;

    protected currentlyDraggedItem: HTMLDivElement | undefined;
    protected draggedStartingPosition: ToolbarItemPosition | undefined;
    protected deferredRef = new Deferred<HTMLDivElement>();
    protected isBusyDeferred = new Deferred<void>();

    constructor() {
        super();
        this.removeClass(TabBarToolbar.Styles.TAB_BAR_TOOLBAR);
        this.addClass(OniroVerticalToolbar.Styles.VERTICAL_TOOLBAR);
    }

    @postConstruct()
    async init(): Promise<void> {
        this.hide();
        await this.model.ready.promise;

        this.updateInlineItems();
        this.update();

        await this.deferredRef.promise;
    }

    protected updateInlineItems(): void {
        this.inline.clear();
        const { items } = this.model.toolbarItems;
        const group = items.right[0];
        const contextKeys = new Set<string>();
        for (const item of group) {
            this.inline.set(item.id, item);

            if (item.when) {
                this.contextKeyService.parseKeys(item.when)?.forEach(key => contextKeys.add(key));
            }
        }
        this.updateContextKeyListener(contextKeys);
    }

    protected renderGroup(group: ToolbarItem[]): React.ReactNode[] {
        const nodes: React.ReactNode[] = [];
        group.forEach(item => {
            let toolbarItemClassNames = '';
            let renderBody: React.ReactNode;

            if (TabBarToolbarItem.is(item)) {
                toolbarItemClassNames = TabBarToolbar.Styles.TAB_BAR_TOOLBAR_ITEM;
                if (this.evaluateWhenClause(item.when)) {
                    toolbarItemClassNames += ' enabled';
                }
                renderBody = this.renderItem(item);
            } else {
                const contribution = this.model.getContributionByID(item.id);
                if (contribution) {
                    renderBody = contribution.render();
                }
            }
            nodes.push(<div
                role='button'
                tabIndex={0}
                data-id={item.id}
                id={item.id}
                key={item.id}
                className={`${toolbarItemClassNames} toolbar-item action-label`}
                onClick={this.executeCommand}
            >
                {renderBody}
                <div className='hover-overlay' />
            </div>);
        });
        return nodes;
    }

    protected assignRef = (element: HTMLDivElement): void => this.doAssignRef(element);
    protected doAssignRef(element: HTMLDivElement): void {
        this.deferredRef.resolve(element);
    }
    protected override render(): React.ReactNode {
        const rightGroup = this.model.toolbarItems?.items[ToolbarAlignment.RIGHT][0];
        return (
            <>
                {this.renderGroup(rightGroup)}
            </>
        );
    }

    protected override renderItem(
        item: TabBarToolbarItem
    ): React.ReactNode {
        const classNames = [];
        if (item.text) {
            for (const labelPart of this.labelParser.parse(item.text)) {
                if (typeof labelPart !== 'string' && LabelIcon.is(labelPart)) {
                    const className = `fa fa-${labelPart.name}${labelPart.animation ? ' fa-' + labelPart.animation : ''}`;
                    classNames.push(...className.split(' '));
                }
            }
        }
        const command = this.commands.getCommand(item.command);
        const iconClass = (typeof item.icon === 'function' && item.icon()) || item.icon || command?.iconClass;
        if (iconClass) {
            classNames.push(iconClass);
        }
        let itemTooltip = '';
        if (item.tooltip) {
            itemTooltip = item.tooltip;
        } else if (command?.label) {
            itemTooltip = command.label;
        }
        const keybindingString = this.resolveKeybindingForCommand(command?.id);
        itemTooltip = `${itemTooltip}${keybindingString}`;

        return (
            <div
                id={item.id}
                className={classNames.join(' ')}
                title={itemTooltip}
            />
        );
    }

    protected resolveKeybindingForCommand(commandID: string | undefined): string {
        if (!commandID) {
            return '';
        }
        const keybindings = this.keybindingRegistry.getKeybindingsForCommand(commandID);
        if (keybindings.length > 0) {
            const binding = keybindings[0];
            const bindingKeySequence = this.keybindingRegistry.resolveKeybinding(binding);
            const keyCode = bindingKeySequence[0];
            return ` (${this.keybindingRegistry.acceleratorForKeyCode(keyCode, '+')})`;
        }
        return '';
    }
}

export namespace OniroVerticalToolbar {

    export namespace Styles {
        export const VERTICAL_TOOLBAR = 'p-vertical-toolbar';
        export const VERTICAL_TOOLBAR_ITEM = 'item';

    }

}
