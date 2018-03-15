'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
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

        // Path of working directory
        let path = vscode.workspace.rootPath;
        // Instance tools class
        let tools = new Tools();

        // Check if working directory is loaded
        if (path !== undefined) {
            // Exclude folders o files by name
            let excludeFoldersAndFiles = [
                'node_modules',
                '.git',
                '.vscode',
                '.idea',
                'vsStackBlitzTmpFile.html',
            ];

            /*
            // List of no raws extension
            let noRawsExtension = [
                'html',
                'scss',
                'ts',
                'json'
            ];
            */

            // Ask to template
            vscode.window.showQuickPick(['angular-cli', 'create-react-app', 'typescript', 'javascript']).then((value) => {

                // Get template
                let template = value;

                // Check template
                if (value !== undefined) {

                    // Get all files recursives exclude some folders
                    let filesWorking = tools.walkSync(path, excludeFoldersAndFiles, []);

                    // Variable with data of package.json
                    let packageData: any = '';

                    // Variable with HTML with content of file and name
                    let htmlNameAndContentFiles = '';

                    // Read all files and get the data
                    filesWorking.forEach((element: string) => {
                        try {
                            let data = fs.readFileSync(element, 'utf-8');
                            let insideFilePath = element.replace(path + '/', '');

                            if (insideFilePath === 'package.json') {
                                packageData = JSON.parse(data);
                            } else {
                                /*
                                 let fileExtension = tools.getExtension(element);
         
                                 if (noRawsExtension.some(x => x === fileExtension)) {
                                     html += '<input type="hidden" name="project[files][' + insideFilePath + ']" value="' + tools.encodeHTML(data) + '">';
                                 } else {
                                     html += '<input type="hidden" name="project[files][' + insideFilePath + ']" value="' + data + '">';
                                 }
                                 */

                                htmlNameAndContentFiles += '<input type="hidden" name="project[files][' + insideFilePath + ']" value="' + tools.encodeHTML(data) + '">';
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    });

                    let dependencies: any = {};

                    Array.from(Object.keys((packageData.dependencies))).forEach((element: string) => {
                        dependencies[element] = packageData.dependencies[element];
                    });

                    Array.from(Object.keys((packageData.devDependencies))).forEach((element: string) => {
                        dependencies[element] = packageData.devDependencies[element];
                    });

                    let htmlDependencies = '<input type="hidden" name="project[dependencies]" value="' + tools.encodeHTML(JSON.stringify(dependencies)) + '">';

                    let html = '<html lang="en">';
                    html += '<head>Redirect to StackBlitz...</head>';
                    html += '<body>';
                    html += '<form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">';
                    // Input Files
                    html += htmlNameAndContentFiles;
                    // Input Tags
                    html += '<input type="hidden" name="project[tags][0]" value="vscode">';
                    html += '<input type="hidden" name="project[tags][1]" value="example">';
                    html += '<input type="hidden" name="project[tags][2]" value="autogenerate">';
                    // Input Description
                    html += '<input type="hidden" name="project[description]" value="Autogenerated by VSCode Plugin">';
                    // Input Dependencies
                    html += htmlDependencies;
                    // Input Template
                    html += '<input type="hidden" name="project[template]" value="' + template + '">';
                    html += '</form>';
                    html += '<script>document.getElementById("mainForm").submit();</script>';
                    html += '</body>';
                    html += '</html>';

                    // Write HTML File
                    fs.writeFile(path + "\\vsStackBlitzTmpFile.html", html, (err: any) => {
                        if (err) {
                            return console.log(err);
                        }

                        // Ask the browser
                        vscode.window.showQuickPick(tools.acceptBrowsers()).then((item: any) => {
                            if (!item) {
                                return;
                            }

                            // Open file
                            tools.openFile(path + "\\vsStackBlitzTmpFile.html", item);
                              // Delete file in 10 seconds [for slow PC]
                            setTimeout(() => {
                                fs.unlinkSync(path + "\\vsStackBlitzTmpFile.html");
                            }, 10000);
                        });
                    });
                }


            });
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}