import nodesSorter from './nodesSorter'


export default function addFile(path = [], obj = {}, name) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1] && typeof obj[path[0]][path[1]] === 'object') {
            const newPath = path.slice(1)
            newObj[path[0]] = addFile(newPath, obj[path[0]], name)
        } else {
            newObj = [ ...obj, name ].sort(nodesSorter)
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: addFile(newPath, obj[path[0]], name)}
        } else {
            const newDirectoryFiles = [ ...obj[path[0]], name ].sort(nodesSorter)
            newObj = { ...obj, [path[0]]: newDirectoryFiles }
        }
    }
    
    return newObj
}
