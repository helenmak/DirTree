export default function addDirectory(path = [], obj = {}, name) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj[path[0]] = addDirectory(newPath, obj[path[0]], name)
        } else {
            newObj[path[0]] = [ ...obj[path[0]], { [name]: [] } ]
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: addDirectory(newPath, obj[path[0]], name)}
        } else {
            newObj = {...obj, [path[0]]: [ ...obj[path[0]], { [name]: [] } ] }
        }
    }
    
    return newObj
}
