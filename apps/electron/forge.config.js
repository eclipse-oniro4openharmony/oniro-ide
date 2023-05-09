
module.exports = {
    packagerConfig: {

    },
    makers: [
        {
            name: '@electron-forge/maker-zip'
        },
        {
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32']
        },
        {
            name: '@electron-forge/maker-dmg',
            platforms: ['darwin']
        },
        {
            name: '@electron-forge/maker-deb',
            platforms: ['linux']
        }
    ],
    hooks: {
        prePackage: async () => {
            console.log('Build Electron App');
            await asyncExec('yarn build');    
        },
        postPackage: async (_, platform) => {
            const fs = require('fs-extra');
            for(outputPath of platform.outputPaths) {
                const appOutPath = `${outputPath}/${process.platform === 'darwin' ? 'oniro-ide-electron.app/Contents/Resources' : 'resources'}/app`;
                const packageJsonPath = `${appOutPath}/package.json`;

                console.log('Modifying Bundle package.json')
                const packageJson = require(packageJsonPath);
                packageJson.dependencies['oniro-ide-extension'] = `file:${process.cwd()}/../../oniro-ide-extension`;
                packageJson.main = 'scripts/oniro-electron-main.js';
                delete packageJson.devDependencies;
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

                console.log('Install Dependencies');
                await asyncExec(`yarn -s --cwd ${appOutPath}`, {stdio: 'inherit'});

                console.log('Rebuild Native Dependencies');
                await asyncExec(`yarn --cwd ${appOutPath} rebuild`);

                console.log('Copy Plugins');
                if(!fs.existsSync('../../plugins')) {
                    await asyncExec('yarn --cwd ../../ download:plugins');
                }                
                fs.copySync('../../plugins', appOutPath + '/plugins');
            }
        }
    }
}

const {exec} = require('child_process');
async function asyncExec(command, options) {
    return new Promise((resolve, reject) => {
        exec(command, options, (err) => err ? reject(err) : resolve('success'));    
    });
}