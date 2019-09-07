export default function checkNodeExist(path = [], obj = {}, val) {
    console.log(path)
    
    if (Array.isArray(obj)) {
        const newPath = path.slice(1)
        console.log(newPath, obj[path[0]], val)
        return checkNodeExist(newPath, obj[path[0]], val)
    } else {
        if (path[1]) {
            const newPath = path.slice(1)
            console.log(newPath, obj[path[0]], val)
            return checkNodeExist(newPath, obj[path[0]], val)
        } else {
            console.log(obj[path[0]], val, obj[path[0]][val])
            
            //cause CmdResource contains not array of dirs, but array with objects of dirs
            if (Array.isArray(obj[path[0]])) {
                return obj[path[0]].includes(val) || obj[path[0]].some(item => item[val])
            } else {
                return obj[path[0]][val]
            }
        }
    }
}
