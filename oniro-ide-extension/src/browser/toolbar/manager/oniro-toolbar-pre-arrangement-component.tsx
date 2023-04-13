import { Command } from '@theia/core';
import { useState, useEffect } from '@theia/core/shared/react';
import * as React from 'react';
import '../../../../src/browser/toolbar/manager/oniro-toolbar-manager-component.css';

type OniroToolbarPreArrangementComponentProps = {
    isPreArranged: boolean;
    commands: Command[];
    title: string;
    onSelectedCommandsChange: (isPreArr: boolean) => void;
};

const OniroToolbarPreArrangementComponent: React.FC<OniroToolbarPreArrangementComponentProps> = (props: OniroToolbarPreArrangementComponentProps) => {
    const { isPreArranged, title, commands, onSelectedCommandsChange } = props;
    const [preArranged, setPreArranged] = useState(isPreArranged);

    const renderCommandList = (commands: Command[]) => {
        return commands.map((command, idx) => (
            <div
                title={command.label}
                key={command.id}
                className={`command-list-element ${idx === 0 ? 'first' : ''} ${idx === commands.length - 1 ? 'last' : ''}`}
            >
                {command.iconClass && <i className={command.iconClass}></i>}
                {command.label && <div className='label'>{command.label}</div>}
            </div>
        ));
    };

    const handleChangePreArranged = () => {
        setPreArranged(!preArranged);
    };

    useEffect(() => {
        onSelectedCommandsChange(preArranged);
    }, [preArranged]);

    return (
        <div className="command-list" key="command-list">
            <div className="category-container">
                <div className="category-label">{title}</div>
                <div className="command-button-container">
                    {renderCommandList(commands)}
                    <div className='arrangement-check'>
                        <input type="checkbox" checked={isPreArranged} onChange={handleChangePreArranged} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OniroToolbarPreArrangementComponent;
