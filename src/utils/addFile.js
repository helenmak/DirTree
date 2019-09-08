import nodesSorter  from './nodesSorter'
import ensureDir from './ensureDir'


export default function addFile(path = [], obj = {}, name) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1] && typeof obj[path[0]][path[1]] === 'object') {
            const newPath = path.slice(1)
            newObj[path[0]] = addFile(newPath, obj[path[0]], name)
        } else {
            if (name.includes('/')) {
                const nameArr = name.split('/')
                const pathToCreate = nameArr.slice(0, nameArr.length - 1)
                const newPath = path.slice(1).concat(pathToCreate)
    
                const fileName = nameArr[nameArr.length - 1]
    
                const createdObjWithFile = ensureDir(newPath, obj[path[0]], fileName)
                const newDirectoryFiles = [ ...obj[path[0]], createdObjWithFile ].sort(nodesSorter)
                
                newObj = [...obj, newDirectoryFiles ]
            } else {
                newObj = [ ...obj, name ].sort(nodesSorter)
            }
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: addFile(newPath, obj[path[0]], name)}
        } else {
            if (name.includes('/')) {
                const nameArr = name.split('/')
                const pathToCreate = nameArr.slice(0, nameArr.length - 1)
                const newPath = path.slice(1).concat(pathToCreate)
    
                const fileName = nameArr[nameArr.length - 1]
    
                const createdObjWithFile = ensureDir(newPath, obj[path[0]], fileName)
                const newDirectoryFiles = createdObjWithFile.sort(nodesSorter)
    
                newObj = { ...obj, [path[0]]: newDirectoryFiles }
            } else {
                const newDirectoryFiles = [ ...obj[path[0]], name ].sort(nodesSorter)
                newObj = { ...obj, [path[0]]: newDirectoryFiles }
            }
        }
    }
    
    return newObj
}
