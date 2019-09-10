export default function nodesSorter(prevNode, nextNode) {
    console.log('sorter')
    if(typeof prevNode === 'object' && typeof nextNode === 'object') {
        const prevName = Object.keys(prevNode)[0].toLowerCase()
        const nextName = Object.keys(nextNode)[0].toLowerCase()
        
        if(prevName < nextName) return -1
        if(prevName > nextName) return 1
        
        return 0
    }
    
    if(typeof prevNode === 'object') {
        console.log(prevNode)
        return -1
    }
    if(typeof nextNode === 'object') return 1
    
    if(prevNode.toLowerCase() < nextNode.toLowerCase()) return -1
    if(prevNode.toLowerCase() > nextNode.toLowerCase()) return 1
    
    return 0
}
