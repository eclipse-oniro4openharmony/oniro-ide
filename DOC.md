# Documentation
## Requirement 1: Definition of the user interface and flow improvements
### Design documentation
#### Customising the Toolbar
--

## Requirement 4: VS Code API usage & Theia extension - VS Code extension communication
### Design documentation
#### Communication between theia and VScodeExtension
To enable communication between Eclipse Theia and VSCode extensions, Theia's `CommandRegistry` can be used. It allows extensions to register and invoke commands. All commands defined in a VSCode Extension are registered in the `CommandRegistry` after the extension has been loaded. 
To invoke such a command implemented by a VSCode extension, Eclipse Theia extensions can use the executeCommand method in the command registry which looks like this: `executeCommand<T>(commandId: string, ...args: any[]): Promise<T | undefined>`. 

It's important to note that if the VSCode extension that implements the command is not installed, or if the command ID is incorrect, an error will be thrown. Therefore, it's good practice to catch and handle these errors.

**Example:**
To try a simple example one can install the notification-sample-vsix into the Oniro theia instance with the `Extensions: Install from VSIX...` command. 
The vsix can be found [here](./example-assets/notifications-sample-0.0.1.vsix)
and is generated from [VSCode notification sample](https://github.com/microsoft/vscode-extension-samples/tree/main/notifications-sample).

Every command registered in this extension is callable in theia simply by its id.  
This is implemented in [oniro-toolbar-commands.ts](./oniro-ide-extension/src/browser/toolbar/manager/oniro-toolbar-commands.ts#L25).
There the example-command is registered and executes the 'notifications-sample.showInfo' command from the VSCode extension.
Furthermore one can see in the same file how it is added to the toolbar manager: the command needs to be added to the array which is returned by the method getOniroCommands().
