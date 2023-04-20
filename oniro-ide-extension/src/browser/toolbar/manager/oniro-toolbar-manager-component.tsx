import { Command } from '@theia/core';
import * as React from 'react';
import '../../../../src/browser/toolbar/manager/oniro-toolbar-manager-component.css';
import { groupCommands } from './oniro-toolbar-utils';

type OniroCommandListComponentProps = {
    selected: Set<string>;
    commands: Command[];
    onSelectedCommandsChange: (selectedCommands: string) => void;
};

const OniroCommandListComponent: React.FC<OniroCommandListComponentProps> = (props: OniroCommandListComponentProps) => {
    const { selected, commands, onSelectedCommandsChange } = props;

    const commandGroups = groupCommands(commands);

    const renderCommandButtons = (commands: Command[]) => {
        return commands.map((command) => (
            <button
                title={command.label}
                key={command.id}
                className={`command-button ${selected.has(command.id) ? 'selected' : ''}`}
                onClick={() => handleCommandSelection(command.id)}
            >
                {command.iconClass && <i className={command.iconClass}></i>}
                {command.label && <div className='label'>{command.label}</div>}
            </button>
        ));
    };

    const handleCommandSelection = (id: string) => {
        onSelectedCommandsChange(id);
    };

    // Render the category containers
    const categoryKeys = Object.keys(commandGroups);
    return (
        <div className="command-list" key="command-list">
            {categoryKeys.map((category, index) => (
                <React.Fragment key={category + 'Fragment'}>
                    <div className="category-container">
                        <div className="category-label">{category}</div>
                        <div className="command-button-container">
                            {renderCommandButtons(commandGroups[category])}
                        </div>
                    </div>
                    {index < categoryKeys.length - 1 && <div className="separator-line"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default OniroCommandListComponent;
