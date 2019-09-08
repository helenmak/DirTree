export default function checkFileExist(path = [], obj = {}, name) {
    if (Array.isArray(obj)) {
        const newPath = path.slice(1)
        
        return checkFileExist(newPath, obj[path[0]], name)
    } else {
        if (path[1] && typeof obj[path[0]][path[1]] === 'object') {
            const newPath = path.slice(1)
            
            return checkFileExist(newPath, obj[path[0]], name)
        } else if (Array.isArray(obj[path[0]])) {
            return obj[path[0]].includes(name)
        } else {
            return obj === name
        }
    }
}
