# Documentation
## Requirement 1: Definition of the user interface and flow improvements
### Design documentation
#### **Customising the Toolbar**
In [oniro-toolbar-commands.ts](https://github.com/TypeFox/huawei-ide/blob/c9a7bde939186dd645c1d93633d761a522936d4b/oniro-ide-extension/src/browser/toolbar/manager/oniro-toolbar-commands.ts#L40) commands are registered and/or added to the toolbar manager.  
All commands returned by `getOniroCommands()` are shown in the toolbar manager UI.  

#### **Adding or changing command icons**
The icons that are shown in the toolbar are set on the respective commands. To add or change the icon of a command the iconClass field needs to be set to a css class of one of the following kinds:
1. Use codicon  
You can find the list of codicons here: https://microsoft.github.io/vscode-codicons/dist/codicon.html  
Codicon class names follow this syntax: "codicon codicon-\<*name of the icon*\>"  
Or you can just use the following helper method `codicon('some-codicon-class-name')`. See the [new-project-wizard.tsx](https://github.com/TypeFox/huawei-ide/blob/main/oniro-ide-extension/src/browser/wizards/new-project/new-project-wizard.tsx#L42) as an example.

2. Use fontawesome  
Theia uses the version 4.7.
You can find the list of font awesome icons here: https://fontawesome.com/v4/icons/  
Fontawesome class names follow this syntax: "fa fa-\<*name of the icon*\>"

3. Create your own icons and create a css class with a attribute mask  
It is also possible to use custom icons.  
To achieve that you need to create a css class where you set a mask with a reference to your icon svg or png and set a background-color. See [here](https://github.com/TypeFox/huawei-ide/blob/main/oniro-ide-extension/src/browser/styles/icons.css) for an example.  
Make sure the respective css file is imported [here](https://github.com/TypeFox/huawei-ide/blob/main/oniro-ide-extension/src/browser/styles/index.css).  
You can use that class to set the iconClass field of a command. 

See in [oniro-toolbar-commands.ts](https://github.com/TypeFox/huawei-ide/blob/c9a7bde939186dd645c1d93633d761a522936d4b/oniro-ide-extension/src/browser/toolbar/manager/oniro-toolbar-commands.ts#L29) how iconClasses are set.

#### Creating custom Dialogs and Wizards

Creating a custom dialog in a Theia-Extension is relatively simple. We'll use the `wizard-dialog.tsx` as an example here:

```Typescript
@injectable()
export class WizardDialog extends AbstractDialog {
    ...
}
```

First, we need a class for our Dialog. This class should either extend `AbstractDialog` or `ReactDialog`.
The latter just gives us a `render` method in which we can write jsx/tsx code directly, while the former just exposes the `node`, `titleNode` and `contentNode` HTMLElements which we can modify through the browser javascript API.

With that we can already use our new Dialog by just instantiating and calling the open method like `new WizardDialog(...).open()`.

But since we want our dialog to be able to interact with other parts of theia, or our own services, we need dependency injection.
For this, first we have to annotate our class with `@injectable()`. Next we have to bind it inside of our container which is located in `oniro-ide-frontend-module.ts`. Since our dialog is probably stateful, we want to create a new instance each time we open it. To achieve that, we create a factory instead of binding it as a singleton or constant value:

```Typescript
bind(NewProjectWizardFactory)
    .toFactory(ctx => () => createNewProjectWizardContainer(ctx.container).get(WizardDialog<NewProjectConfig>));
```

In this factory we create a child container in which we bind our dialog to itself and retrieve it afterwards to let it be returned by the factory.

```ts
export function createNewProjectWizardContainer(parent: interfaces.Container): interfaces.Container {
    const child = parent.createChild();
    child.bind(WizardDialogProps).toConstantValue({ title: nls.localize('oniro/newProjectWizard/title', 'Create New Project'), configObject: {} });
    child.bind(WizardDialog<NewProjectConfig>).toSelf();
    return child;
}
```

This allows us to use `@inject(...)` inside of our dialog class. Also we can bind other constant values like configuration objects or similiar which could also be parameters of the factory method and then be injected into our dialog.

To open our dialog we now inject the factory into wherever its needed like for example a `CommandContribution`:

```ts
class WizardCommands implements CommandContribution {

    @inject(NewProjectWizardFactory)
    private newProjectWizardFactory: () => WizardDialog<NewProjectConfig>;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(NEW_PROJECT_COMMAND, {execute: async () => {
            this.newProjectWizardFactory().open();
        }});
    }
}
``` 

## Requirement 2: Multiplatform Desktop IDE and Web IDE
### Design documentation
#### **Desktop Application Build**
The Theia desktop application is realized through electron. For the Oniro IDE [electron-forge](https://www.electronforge.io/) is used for building the different distributables.
To install all dependencies required by electron forge first execute `yarn` in the root directory.
execute `yarn electron make` to package the application and build the distributables. 
execute `yarn electron package` for just creating the package without building the distributables. 
The packaging step can take a while. 
After building the package and distributables, they can be found at `apps/electron/out`. The `oniro-ide-electron-{your platform}` folder contains the package while the `make` folder contains the distributables   

Currently included electron-forge makers for creating distributables from the package are the following:
- **maker-zip** (*System Independ*): Will just create a simple zip file containing the electron package
- **maker-squirrel** (*Windows*): creates a [squirrel executable](https://github.com/Squirrel/Squirrel.Windows) for installing on Windows
- **maker-dmg** (*macOS*): creates a dmg file for installing on macOS
- **maker-deb** (*linux*): creates a deb file for installing on debian based linux distributions
Further configuration and disabling or adding of makers can be done in the apps/electron/forge.config.js file 

## Requirement 4: VS Code API usage & Theia extension - VS Code extension communication
### Design documentation
#### **Communication between theia and VScodeExtension**
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
