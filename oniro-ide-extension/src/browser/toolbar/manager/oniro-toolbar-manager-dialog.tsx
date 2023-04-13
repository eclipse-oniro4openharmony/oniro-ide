import * as React from 'react';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { ReactNode } from '@theia/core/shared/react';
import { Dialog } from '@theia/core/lib/browser';
import OniroCommandListComponent from './oniro-toolbar-manager-component';
import OniroToolbarPreArrangementComponent from './oniro-toolbar-pre-arrangement-component';
import { Command } from '@theia/core';

export const OniroToolbarManagerDialogProvider = Symbol('OniroToolbarManagerDialogProvider');

export class OniroToolbarManagerDialog extends ReactDialog<Set<string>> {
    protected _selectedCommands: Set<string> = new Set();

    constructor(
        protected initiallySelectedCommands: Set<string>,
        protected oniroCommands: Command[]
    ) {
        super({
            title: "Oniro Toolbar Manager",
        });
        this.appendAcceptButton(Dialog.OK);
        // this.render();
    }

    protected render(): ReactNode {
        const cmds = this.oniroCommands;

        const DialogContainer: React.FC<{}> = () => {
            const [selectedCommands, setSelectedCommands] = React.useState(this.initiallySelectedCommands);
            const [isCompilationPreArr, setIsCompilationPreArr] = React.useState(false);
            const [isDebugPreArr, setIsDebugPreArr] = React.useState(false);
            const [preArrOn, setPreArrOn] = React.useState(false);
            const handleSelectionChanged = (id: string) => {
                setPreArrOn(false);
                const newSelectedCommands = new Set(selectedCommands);
                if (selectedCommands.has(id)) {
                    newSelectedCommands.delete(id);
                } else {
                    newSelectedCommands.add(id);
                }
                setSelectedCommands(newSelectedCommands);
            };

            const preArrComp = cmds.filter(c => c.category === 'Project' || c.category === 'Compile' || c.category === 'File');
            const handleCompilationPreArrSelectionChanged = (isSet: boolean) => setIsCompilationPreArr(isSet);

            const preArrDebug = cmds.filter(c => c.category === 'Debug');
            const handleDebugPreArrSelectionChanged = (isSet: boolean) => setIsDebugPreArr(isSet);

            React.useEffect(() => {
                if (isCompilationPreArr && isDebugPreArr) {
                    setPreArrOn(true);
                    const newSelectedCommands = new Set(selectedCommands);
                    preArrComp.forEach(c => newSelectedCommands.add(c.id));
                    preArrDebug.forEach(c => newSelectedCommands.add(c.id));
                    setSelectedCommands(newSelectedCommands);
                } else if (isCompilationPreArr) {
                    setPreArrOn(true);
                    const newSelectedCommands = new Set(selectedCommands);
                    preArrComp.forEach(c => newSelectedCommands.add(c.id));
                    preArrDebug.forEach(c => newSelectedCommands.delete(c.id));
                    setSelectedCommands(newSelectedCommands);
                } else if (isDebugPreArr) {
                    setPreArrOn(true);
                    const newSelectedCommands = new Set(selectedCommands);
                    preArrComp.forEach(c => newSelectedCommands.delete(c.id));
                    preArrDebug.forEach(c => newSelectedCommands.add(c.id));
                    setSelectedCommands(newSelectedCommands);
                } else if (preArrOn){
                    const newSelectedCommands = new Set(selectedCommands);
                    preArrComp.forEach(c => newSelectedCommands.delete(c.id));
                    preArrDebug.forEach(c => newSelectedCommands.delete(c.id));
                    setSelectedCommands(newSelectedCommands);
                }
            }, [isCompilationPreArr, isDebugPreArr])

            React.useEffect(() => {
                this._selectedCommands = selectedCommands;
            }, [selectedCommands]);

            return <>
                <OniroCommandListComponent selected={selectedCommands} commands={cmds} onSelectedCommandsChange={handleSelectionChanged} />
                <OniroToolbarPreArrangementComponent
                    isPreArranged={isCompilationPreArr && preArrOn}
                    commands={preArrComp}
                    title="Compilation Scene"
                    onSelectedCommandsChange={handleCompilationPreArrSelectionChanged} />
                <OniroToolbarPreArrangementComponent
                    isPreArranged={isDebugPreArr && preArrOn}
                    commands={preArrDebug}
                    title="Debug Scene"
                    onSelectedCommandsChange={handleDebugPreArrSelectionChanged} />
            </>;
        }

        return <DialogContainer />;
    }
    get value(): Set<string> {
        return this._selectedCommands;
    }
}