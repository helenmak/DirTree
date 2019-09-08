import nodesSorter from './nodesSorter'


export default function ensureDir(path = [], obj = {}, fileName) {
    let newObj = obj

    const dirContent = fileName ? [fileName] : []
    const dirName = path[0]
    
    if (Array.isArray(obj)) {
        if (!dirName) {
            newObj = fileName ? [ ...obj, fileName ].sort(nodesSorter) : obj
        } else if (!obj[dirName]) {
            const newPath = path.slice(1)
            const content = newPath.length ? ensureDir(newPath, [], fileName) : dirContent
            newObj = [...obj, { [dirName]: content }]
        } else if (path[1]) {
            const newPath = path.slice(1)
            newObj[dirName] = ensureDir(newPath, obj[dirName], fileName)
        } else {
            newObj[dirName] = [ ...obj[dirName], fileName ].sort(nodesSorter)
        }
    } else {
        if (!obj[dirName]) {
            const newPath = path.slice(1)
            const content = newPath.length ? ensureDir(newPath, [], fileName) : dirContent
            newObj = { ...obj, [dirName]: content }
        } else if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [dirName]: ensureDir(newPath, obj[dirName], fileName)}
        } else {
            const newDirectoryFiles = [ ...obj[dirName], { [dirName]: dirContent } ].sort(nodesSorter)
            newObj = { ...obj, [dirName]: newDirectoryFiles }
        }
    }
    
    return newObj
}
