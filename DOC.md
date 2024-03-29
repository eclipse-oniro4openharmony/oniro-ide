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
#### Desktop Application Build
As previously discussed, we have migrated the electron bundling process to electron-builder. To generate the electron installer, you have two options: `yarn electron dist` and `yarn electron package`.

When using `yarn electron dist`, all the prerequisites are taken care of, such as installing dependencies, rebuilding native dependencies, and building the application itself. 
On the other hand, if you prefer to use yarn electron package, please ensure that the electron application is ready for execution by running `yarn electron start`.

Both of these tasks create the package installers for the current operating systems. 
- For Windows: NSIS
- For Linux: deb and AppImage 
- For macOS: dmg and zip.

If you wish to fine-tune the process, you can easily configure it through the electron-builder.yml file. 
This allows for further customization of the installers to meet your specific requirements and preferences.
#### Cloud Deployment

##### Docker Image

The `Dockerfile` in the source of the repository contains build instructions for a docker image that contains the browser version of the Oniro IDE.

It is based on Ubuntu and installs all vscode extensions and native dependencies (compilers and other toolchains) during build time.

##### Workspace Management

Just the Docker image isn't enough to build a cloud deployment for a Theia application. Cloud IDEs (Theia/VSCode) require some sort of **workspace management solution**.
The workspace management is in charge of deploying new workspaces on the fly when needed. A common example workflow might look like this:

1. A user initiates to open a repository from GitHub
2. `git clone` is executed for the specific repository on a remote service
3. A kubernetes operator starts a new pod with the IDE inside
4. The git repository gets mounted into the pod as a volume
5. The user is redirected to the newly started IDE pod and loads the cloned repository

None of features are part of Theia itself and need to be controlled by the surrounding infrastructure of the cloud deployment.
There are a few workspace management solutions available, however, only [Eclipse Theia-Cloud](https://theia-cloud.io/) actually has builtin support for Theia apps.
Other solutions such as [Eclipse Che](https://www.eclipse.org/che/) or [Gitpod](https://www.gitpod.io/) have dropped support for Theia in the recent years and switched to VSCode instead.

Theia-Cloud works using a simple [Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/).
The operator can deploy new instances of Theia apps using vanilla Kubernetes.
This means it can be used in any environment with Kubernetes support, such as Google Cloud or AWS.
Theia-Cloud spawns new pods on demand using a simple HTTP-Request system. That allows it to integrate into existing automation infrastructure.

## Requirement 3: Account Management
### Concept Documentation
Theia cloud uses (Keycloak)[https://www.keycloak.org/] for Account management (see https://github.com/eclipsesource/theia-cloud/blob/main/doc/docs/Architecture.md for more details). 
We would recommend doing the same or using a similar central Identity and Access Management solution.

For achieving authentication with Keycloak, Theia would be deployed behind a reverse proxy which would authenticate users against a Keycloak instance before allowing access.

After authentication, the theia frontend could then use the Keycloak API to retrieve the authenticated users data. 
Based on this data the frontend could manage showing/hiding of features or display different perspectives.

To fully disable features for different account types we would also need to implement backend-side authorization. 
One possibility to archieve this is to create a custom socket.io middleware. 
Since most features are running under their own separate socket.io namespace, specific namespaces could be blocked through the middleware based on the user data.

### Design documentation
For the POC authentication is done via Basic Auth. As discussed the Authentication is deactivated by default by the `AUTH_ACTIVE` flag found in `auth-validator-contribution.ts`.

The backend is secured by `AuthRequestValidatorContribution`. This needs to be changed when implementing other authentication methods.

On frontend-side we override the default creation of the websocket in `authenticating-websocket-connection-provider.ts`. Our new websocket contains a `Authorization` header.
We also listen for events that signal that the server denied the connection. When that happens we display the `auth-widget` instead of starting the `frontend-application`.

The best way to restart the server connection is to reload the page. 
Thats why we save save the authentication information locally. 
This way, at subsequent application start the user does not need to login again.

A logout command is also provided with a corresponding menu entry in the `file` menu.

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

#### **prebundle DevEco Extension with oniro-ide**
**plugins**
The plugins should be prebundled with the Oniro-IDE. For that they will be needed in the `/plugins` folder.
The easiest way to do that is probably to set-up a central server from which they can be dowloaded via HTTP (for example a private (openVSx instance)[https://open-vsx.org/]).

After that the urls can be added to the `theiaPlugins` object inside the main `package.json` file. After that they will automaticly be downloaded by the `download:plugins` script.
```json
  "theiaPlugins": {
    //...
    "deveco-device-tool": "https://{your private openVSX instance or other file server}/deveco-device-tool-3.1.500.vsix"
    //... {repeat for the other 3 plugins as well}
  },
```
**Installing Deveco Device tool backend**
The reason we can't implement this right now is, that we don't have download locations that do not require user interaction to accept terms and conditions. So this is just a concept on how bundling this could be accomplished. 
Docker: It should be relativly simple to modify the Dockerfile so it downloads and installs the backend inside the container. important would be that the Venv/Scripts folder is inside the `Path` environment-variable or that the `DEVECO_PENV_DIR` environment variable is set to the install location so that the plugins can find the backend binaries.

Electron: best way would probably be to bundle it with the rest of the application. The `postPackage` hook in `apps/electron/forge.config` could be used to copy the backend in to `out/oniro-ide-elecrton-{system}/resources`.
That way the installer would just unpack it together with the electron app itself.

The plugins of course would need to know the install location of the backend. So we would have to add a `BackendContribution` like this and bind it in the container in `onire-ide-backend-module.ts`.
```Typescript
export class DevEcoDeviceToolBackendContribution implements BackendApplicationContribution {
    initialize(): void {
        if(environment.electron.is() && this.checkDeviceToolInstallationValid()) {
            process.env.DEVECO_PENV_DIR = '{dir to Install location}' // probably something like  `${proces.cwd()}../DevEco-Device-Tool/core/deveco-venv`
        }
    }

    checkDeviceToolInstallationValid(): boolean {
        ...
    }
} 
```
This would set `DEVECO_PENV_DIR` envionment variable right at the startup of theia before any plugins are loaded so that this variable would then be known to them on startup

## Requirement 6: Remote Development

The remote development feature is currently under review at [#12618](https://github.com/eclipse-theia/theia/pull/12618). The pull request contains instructions on how to test the feature.
It also contains an architectural outline in its [readme](https://github.com/eclipse-theia/theia/blob/a8b2eeb7cdca7a525db57ac339c425aa7fb6b454/packages/remote/README.md).

Testing this feature together with the current version of the oniro-ide is possible, though quite complicated:
1. Check out the branch linked to the [pull request](https://github.com/eclipse-theia/theia/pull/12618) and compile the contained TypeScript code via `yarn`.
2. Link the `@theia/*` dependencies with your locally checked out sources via the `file://` scheme. (don't forgot the newly added `@theia/remote` extension)
3. Compile the electron app and perform the same steps as outlined in the original [pull request](https://github.com/eclipse-theia/theia/pull/12618).
