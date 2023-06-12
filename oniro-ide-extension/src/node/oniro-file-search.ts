import { CancellationToken, URI } from '@theia/core';
import { FileUri } from '@theia/core/lib/node';
import { FileSearchService } from '@theia/file-search/lib/common/file-search-service';
import { FileSearchServiceImpl } from '@theia/file-search/lib/node/file-search-service-impl';
import * as cp from 'child_process';
import { rgPath } from '@vscode/ripgrep';
import * as readline from 'readline';

export class OniroFileSearch extends FileSearchServiceImpl {

    doFindX(rootUri: URI, options: FileSearchService.BaseOptions, accept: (fileUri: string) => void, token: CancellationToken): Promise<void> {
        return new Promise((resolve, reject) => {
            const cwd = FileUri.fsPath(rootUri);
            const args = this['getSearchArgs'](options);
            const ripgrep = cp.spawn(rgPath, args, { cwd });
            console.log('Spawning with arguments: ', { cwd });
            ripgrep.on('error', reject);
            ripgrep.on('exit', (code, signal) => {
                if (typeof code === 'number' && code !== 0) {
                    reject(new Error(`"${rgPath}" exited with code: ${code}`));
                } else if (typeof signal === 'string') {
                    reject(new Error(`"${rgPath}" was terminated by signal: ${signal}`));
                }
            });
            token.onCancellationRequested(() => {
                ripgrep.kill(); // most likely sends a signal.
                resolve(); // avoid rejecting for no good reason.
            });
            const lineReader = readline.createInterface({
                input: ripgrep.stdout,
                crlfDelay: Infinity,
            });
            lineReader.on('line', line => {
                if (!token.isCancellationRequested) {
                    accept(line);
                }
            });
            lineReader.on('close', () => resolve());
        });
    }

}

FileSearchServiceImpl.prototype['doFind'] = OniroFileSearch.prototype.doFindX;
