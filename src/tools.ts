export default class Tools {

    // https://gist.github.com/kethinov/6658166
    walkSync(dir: any, excludeFoldersAndFiles: Array<string>, filelist: any) {
        if (dir[dir.length - 1] !== '/') {
            dir = dir.concat('/');
        }

        var fs: any = fs || require('fs');
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
}