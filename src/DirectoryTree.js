import React from 'react'

import { fetchDirectoryStructure } from './services/api'

import ExtensionToIcon from './ExtensionToIcon'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import styles from './DirectoryTree.css'


export default class DirectoryTree extends React.PureComponent {
    state = {
        dirStructure: null,
        expandedDirs: []
    }
    
    async componentDidMount() {
        const dirStructure = await fetchDirectoryStructure();
        
        console.log(dirStructure)
        
        this.setState(() => ({ dirStructure }))
    }
    
    renderDirStructure = (structure, level = 0, parentDir = '') => {
        if (!structure) return (
            <div>
                No directory tree
            </div>
        )
        if (typeof structure === 'string') {
            const extension = structure.split('.').reverse()[0]
            
            return (
                <div
                    className={styles.EndNode}
                    style={{ marginLeft: level*10 }}
                    key={`endnode${structure}${level}`}
                >
                    {<img src={require(`./assets/${ExtensionToIcon(extension)}`)} alt="" />}
                    {structure}
                </div>
            )
        }
        
        const tree = [];
        
        if (Array.isArray(structure)) {
            const treePart = (
                <div
                    className={styles.DirectoryNodes}
                    style={{ marginLeft: level*10 }}
                    key={`nodeswrapper${parentDir}`}
                >
                    {structure.map(node => this.renderDirStructure(node, level + 1, parentDir))}
                </div>
            )
            tree.push(treePart)
        } else {
            for(const dirName in structure) {
                const subDir = structure[dirName]
                
                const isDirExpanded = Boolean(this.state.expandedDirs.find(expandedItem => {
                    return expandedItem.dirName === dirName && expandedItem.level === level
                }))
        
                const treePart =  (
                    <div key={`dir${dirName}${level}`}>
                        <div
                            className={styles.Directory}
                            style={{ marginLeft: level*10 }}
                        >
                            {isDirExpanded
                             ? this.renderCollapseSign(dirName, level)
                             : this.renderExpandSign(dirName, level)}
                             
                            {<img src={folderIcon} alt="" />}

                            <div>
                                {dirName}
                            </div>
                        </div>
                        {isDirExpanded
                         ? this.renderDirStructure(subDir, level + 1, dirName)
                         : null}
                    </div>
                )
        
                tree.push(treePart)
            }
        }
        
        return tree;
    }
    
    renderCollapseSign = (dirName, level) => {
        return (
            <img
                src={arrowUp}
                alt='Collapse'
                title='Collapse'
                onClick={() => this.handleCollapse(dirName, level)}
            />
        )
    }
    
    renderExpandSign = (dirName, level) => {
        return (
            <img
                src={arrowDown}
                alt='Expand'
                title='Expand'
                onClick={() => this.handleExpand(dirName, level)}
            />
        )
    }

    
    handleCollapse = (dirName, level) => {
        const nextExpandedDirs = this.state.expandedDirs.filter(expandedItem => {
            return !(expandedItem.dirName === dirName && expandedItem.level === level)
        })
        this.setState(() => ({ expandedDirs: nextExpandedDirs }))
    }
    
    handleExpand = (dirName, level) => {
        this.setState((prevState) => ({ expandedDirs: [ ...prevState.expandedDirs, { dirName, level } ] }))
    }

    
    render() {
        return (
            <div>
                {this.renderDirStructure(this.state.dirStructure)}
            </div>
        )
    }
}
