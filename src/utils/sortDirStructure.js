export default function sortDirStructure(dirStructure, sorter) {
    if (!dirStructure) return null
    
    if (Array.isArray(dirStructure)) {
        return dirStructure.sort(sorter)
    } else {
        const sortedDirStructure = {}
        
        for(const property in dirStructure) {
            if (!dirStructure.hasOwnProperty(property)) continue
            
            const sortedVal = sortDirStructure(dirStructure[property])
    
            sortedDirStructure[property] = sortedVal
        }
        
        return sortedDirStructure
    }
}
