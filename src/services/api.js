export const fetchDirectoryStructure = async () => {
    const res = await fetch('../sources/DirStructure.json')
    return res.json()
}
