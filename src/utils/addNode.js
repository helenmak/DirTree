export default function addNode(path = [], obj = {}, val) {
    let newObj = obj
    
    if (Array.isArray(obj)) {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj[path[0]] = addNode(newPath, obj[path[0]], val)
        } else {
            newObj[path[0]] = [ ...obj[path[0]], val ]
        }
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            newObj = {...obj, [path[0]]: addNode(newPath, obj[path[0]], val)}
        } else {
            if (Array.isArray(obj[path[0]])) {
                newObj = {...obj, [path[0]]: [ ...obj[path[0]], val ]}
            } else {
                newObj = {...obj, [path[0]]: { ...obj[path[0]], [val]: [] } }
            }
        }
    }
    
    return newObj
}
