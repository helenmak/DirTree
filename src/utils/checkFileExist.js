export default function checkFileExist(path = [], obj = {}, name) {
    if (Array.isArray(obj)) {
        const newPath = path.slice(1)
        
        return checkFileExist(newPath, obj[path[0]], name)
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            
            return checkFileExist(newPath, obj[path[0]], name)
        } else {
            //cause CmdResource contains not array of dirs, but array with objects of dirs
            if (Array.isArray(obj[path[0]])) {
                const foundNode = obj[path[0]].find(nodeName => nodeName === name)
                const isNodeFile = foundNode && typeof foundNode !== 'object'
        
                return isNodeFile
            } else {
                const foundNode = obj[path[0]][name]
                const isNodeFile = foundNode && typeof foundNode !== 'object'
        
                return isNodeFile
            }
        }
    }
}
