export default function deleteNode(path = [], obj = {}, name) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj[path[0]] = deleteNode(newPath, obj[path[0]], name)
        } else {
            if(Array.isArray(obj[path[0]])) {
                // if directory node is deleting
                newObj[path[0]] = obj[path[0]].filter(item => {
                    return typeof item === 'object' ? item[name] !== name : item !== name
                })
            } else if (typeof obj[path[0]] === 'object') {
                // if directory node in 'CmdResource' is deleting
                const objEntries = Object.entries(obj[path[0]])
                const objEntriesFiltered = objEntries.filter(entry => {
                    return entry[0] !== name
                })
    
                newObj[path[0]] = Object.fromEntries(objEntriesFiltered)
            } else {
                // if file node is deleting
                newObj = obj.filter(item => item !== name)
            }
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: deleteNode(newPath, obj[path[0]], name)}
        } else {
            const objEntries = Object.entries(obj)
            const objEntriesFiltered = objEntries.filter(entry => {
                return entry[0] !== name
            })
    
            newObj = Object.fromEntries(objEntriesFiltered)
        }
    }
    
    return newObj
}
