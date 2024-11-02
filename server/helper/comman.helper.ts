import fs from "fs"

export const isDirectoryExist = (path: string) => {
    if(!fs.existsSync(path)){
        fs.mkdirSync(path)
    }
    return true;
}
