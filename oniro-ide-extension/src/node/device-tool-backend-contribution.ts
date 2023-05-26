import { isWindows } from "@theia/core";
import { BackendApplicationContribution } from "@theia/core/lib/node";
import { injectable } from "@theia/core/shared/inversify";
import * as fs from 'fs-extra'
import * as path from 'path'

const windowsSearchPaths: readonly string[] = [
    'C:/Program Files/Huawei'
];

const unixSearchPaths: readonly string[] = [
    // TODO find default install path for linux
    '/bin/huawei'
];

const defaultElectronDir = `${process.cwd()}/../DevEco-Device-Tool/core/deveco-venv`


@injectable()
export class DeviceToolBackendContribution implements BackendApplicationContribution {


    initialize(): void {
        if(!process.env.DEVECO_PENV_DIR) {
            process.env.DEVECO_PENV_DIR = this.resolveDevEcoDeviceToolDir() 
        }
    }

    private resolveDevEcoDeviceToolDir(): string {
        if(fs.pathExistsSync(defaultElectronDir)) {
            return defaultElectronDir;
        }

        const searchPaths = isWindows ? windowsSearchPaths : unixSearchPaths;
        for(const searchPath of searchPaths.filter(path => fs.pathExistsSync(path))) {
            if(fs.pathExistsSync(searchPath)) {
                const devEcoDir = this.searchDevEcoInstallDir(searchPath, 3);
                if(devEcoDir) {
                    return path.join(devEcoDir, 'core', 'deveco-venv');
                }
            }
        }
        
        throw new Error('could not find DevEco Device tool install location')
        
    }

    private searchDevEcoInstallDir(searchPath: string, maxDepth: number): string | undefined {
        const subDirecotries = fs.readdirSync(searchPath).filter(dirName => { 
            try {
                return fs.lstatSync(path.join(searchPath, dirName)).isDirectory() 
            } catch {
                return false
            }
            });

        for(const dirname of subDirecotries) {
            if(dirname === 'DevEco-Device-Tool') {
                return path.join(searchPath, dirname);
            } else if(maxDepth > 0) {
                return this.searchDevEcoInstallDir(path.join(searchPath, dirname), maxDepth - 1);
            }
        }
        return undefined;
    }
} 