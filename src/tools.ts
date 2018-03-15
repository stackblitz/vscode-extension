import { exec } from "child_process";
import * as fs from 'fs';
import { platform } from "process";
import * as vscode from 'vscode';

export default class Tools {

    /**
     * 
     * https://gist.github.com/kethinov/6658166
     * @param dir 
     * @param excludeFoldersAndFiles 
     * @param filelist 
     */
    walkSync(dir: any, excludeFoldersAndFiles: Array<string>, filelist: any) {
        if (dir[dir.length - 1] !== '/') {
            dir = dir.concat('/');
        }

        var files = fs.readdirSync(dir);

        filelist = filelist || [];

        files.forEach((file: any) => {
            if (!(excludeFoldersAndFiles.some(x => x === file))) {
                if (fs.statSync(dir + file).isDirectory()) {
                    filelist = this.walkSync(dir + file + '/', excludeFoldersAndFiles, filelist);
                } else {
                    filelist.push(dir + file);
                }
            }
        });

        return filelist;
    }

    /**
     * 
     * https://stackoverflow.com/questions/10865347/node-js-get-file-extension
     * 
     * @param filename 
     */
    getExtension(filename: string) {
        let path = require('path');
        var ext = path.extname(filename || '').split('.');
        return ext[ext.length - 1];
    }

    /**
     * 
     * https://gist.github.com/panzi/1857360
     * @param data 
     */
    encodeHTML(data: string) {
        let html_special_to_escaped_one_map: any = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };

        return data.replace(/([\&"<>])/g, (str: string, item: any) => {
            return html_special_to_escaped_one_map[item];
        });
    }

    acceptBrowsers() {
        /*let chromeItem = {
            detail: "A fast, secure, and free web browser built for the modern web",
            label: "Google Chrome",
            standardName: platform === 'win32' ? 'chrome' : (platform === 'darwin' ? 'google chrome' : 'google-chrome'),
            acceptName: ['chrome', 'google chrome', 'google-chrome', 'gc', '谷歌浏览器']
        };

        let firefoxItem = {
            detail: "A fast, smart and personal web browser",
            label: "Mozilla Firefox",
            standardName: "firefox",
            acceptName: ['firefox', 'ff', 'mozilla firefox', '火狐浏览器']
        };

        let ieItem = {
            detail: "This only works on Windows",
            label: "Microsoft IE",
            standardName: "iexplore",
            acceptName: ['ie', 'iexplore']
        };

        let safariItem = {
            detail: "This only works on Mac OS",
            label: "Apple Safari",
            standardName: "safari",
            acceptName: ['safari']
        };

        let operaItem = {
            detail: 'Fast, secure, easy-to-use browser',
            label: 'Opera',
            standardName: 'opera',
            acceptName: ['opera']
        };*/

        let acceptBrowsers = ['chrome', 'firefox', 'opera'];

        if (process.platform === 'win32') {
            acceptBrowsers.push('Internet Explorer');
        } else if (process.platform === 'darwin') {
            acceptBrowsers.push('Safari');
        }

        return acceptBrowsers;
    }

    openFile(path: string, browser: string) {
        let cmd;
        let platform = process.platform;

        let browserName = '';

        switch (browser) {
            case 'chrome':
                browserName = (platform === 'win32' ? 'chrome' : (platform === 'darwin' ? 'google chrome' : 'google-chrome'));
                break;
            case 'firefox':
                browserName = 'firefox';
                break;
            case 'opera':
                browserName = 'opera';
                break;
            case 'Internet Explorer':
                browserName = 'iexplore';
                break;
            case 'Safari':
                browserName = 'safari';
                break;

        }

        switch (platform) {
            case 'win32':
                cmd = browserName ? 'start ' + browserName + ' "' + path + '"' : 'start ""' + '"path"';
                break;
            case 'darwin':
                cmd = browserName ? 'open "' + path + '" -a "' + browserName + '"' : 'open "' + path + '"';
                break;
            default:
                cmd = browserName ? browserName + ' "' + path + '"' : 'xdg-open "' + path + '"';
                break;
        }

        exec(cmd, (err) => {
            if (err) {
                vscode.window.showErrorMessage('error occured!!');
            }
        });
    }
}