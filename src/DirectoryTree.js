import React from 'react';

import { fetchDirectoryStructure } from './services/api'

export default class DirectoryTree extends React.PureComponent {
    state = {
        dirStructure : null
    }
    
    async componentDidMount() {
        const dirStructure = await fetchDirectoryStructure();
        
        console.log(dirStructure)
        
        this.setState(() => ({ dirStructure }))
    }
    
    renderDirStructure = (structure) => {
        if (!structure) return (
            <div>
                No directory tree
            </div>
        )
        if (typeof structure === 'string') {
            return (
                <div>
                    {structure}
                </div>
            )
        }
        
        const tree = [];
        
        if (Array.isArray(structure)) {
            for(const node of structure) {
                const treePart =  (
                    <div>
                        {this.renderDirStructure(node)}
                    </div>
                )
        
                tree.push(treePart)
            }
        } else {
            for(const node in structure) {
                const subDir = structure[node]
        
                const treePart =  (
                    <div>
                        <div>
                            {node}
                        </div>
                        {this.renderDirStructure(subDir)}
                    </div>
                )
        
                tree.push(treePart)
            }
        }
        
        return tree;
    }
    
    render() {
        return (
            <div>
                {this.renderDirStructure(this.state.dirStructure)}
            </div>
        )
    }
}
