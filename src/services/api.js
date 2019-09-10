export const fetchDirectoryStructure = async () => {
    try {
        const res = await fetch('../sources/DirStructure.json')

        const dirStructure = await res.json()
        
        return { dirStructure }
    } catch (err) {
        return { err }
    }
}
