'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Tools from './tools';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "stackblitz" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.stackblitz.open', () => {
        // The code you place here will be executed every time your command is executed
        var fs = require('fs');
        var path = vscode.workspace.rootPath;
        var tools = new Tools();

        if (path !== undefined) {
            var excludeFoldersAndFiles = [
                'node_modules',
                '.git',
                '.vscode',
                '.idea',
                'vsStackBlitzTmpFile.html'
            ];

            console.log(tools.walkSync(path,excludeFoldersAndFiles, []));

            var html = '<html lang="en">';
            html += '<head></head>';
            html += '<body>';
            html += '<form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">';
            html += '<input type="hidden" name="project[files][index.ts]" value="import { Observable } from \'rxjs/Observable\';\r\nimport \'rxjs/add/observable/fromEvent\';\r\nimport \'rxjs/add/operator/scan\';\r\nvar button = document.querySelector(\'button\');Observable.fromEvent(button, \'click\').scan((count: number) => count + 1, 0).subscribe(count => console.log(`Clicked ${count} times`));">';
            html += '<input type="hidden" name="project[files][index.html]" value="<button>Click Me</button>">';
            html += '<input type="hidden" name="project[tags][0]" value="rxjs">';
            html += '<input type="hidden" name="project[tags][1]" value="example">';
            html += '<input type="hidden" name="project[tags][2]" value="tutorial">';
            html += '<input type="hidden" name="project[description]" value="RxJS Example">';
            html += '<input type="hidden" name="project[dependencies]" value="{&quot;rxjs&quot;:&quot;5.5.6&quot;}">';
            html += '<input type="hidden" name="project[template]" value="typescript">';
            html += '</form>';
            html += '<script>document.getElementById("mainForm").submit();</script>';
            html += '</body>';
            html += '</html>';

            fs.writeFile(path + "\\vsStackBlitzTmpFile.html", html, function (err: any) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}