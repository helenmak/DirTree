import React from 'react'

import { fetchDirectoryStructure } from '../services/api'

import sortDirStructure from '../utils/sortDirStructure'
import nodesSorter      from '../utils/nodesSorter'

import DirectoryTree from '../components/Main/DirectoryTree'


export default class MainPage extends React.PureComponent {
    state = {
        dirStructure: null,
        isLoading: true
    }
    
    async componentDidMount() {
        const { dirStructure, err } = await fetchDirectoryStructure();
        
        if (err) {
            this.setState(() => ({
                error: err,
                isLoading : false
            }))
        } else {
            const sortedDirStructure = sortDirStructure(dirStructure, nodesSorter)
            this.setState(() => ({
                dirStructure: sortedDirStructure,
                isLoading : false
            }))
        }
    }
    
    render() {
        const { dirStructure, error, isLoading } = this.state;
        
        if (isLoading) return (
            <div>
                Loading...
            </div>
        )
    
        if (error) return (
            <div>
                Sorry, an error has occurred when loading directory structure from fs
            </div>
        )
    
        if (!dirStructure) return (
            <div>
                No directory tree
            </div>
        )
        
        return (
            <DirectoryTree dirStructure={dirStructure} />
        )
    }
}
