import nodesSorter from './nodesSorter'


export default function addDirectory(path = [], obj = {}, name) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj[path[0]] = addDirectory(newPath, obj[path[0]], name)
        } else {
            newObj[path[0]] = [ ...obj[path[0]], { [name]: [] } ].sort(nodesSorter)
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: addDirectory(newPath, obj[path[0]], name)}
        } else {
            const newDirectoryFiles = [ ...obj[path[0]], { [name]: [] } ].sort(nodesSorter)
            newObj = { ...obj, [path[0]]: newDirectoryFiles }
        }
    }
    
    return newObj
}
