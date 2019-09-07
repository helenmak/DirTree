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
        expandedDirs: [],
        contextMenu: {
            isOpen: false,
            clientX: null,
            clientY: null
        },
        editedNodeName: '',
        editedNodePath: ''
    }
    
    contextMenu = null
    
    async componentDidMount() {
        const dirStructure = await fetchDirectoryStructure();
        
        console.log(dirStructure)
        
        this.setState(() => ({ dirStructure }))
    }
    
    renderDirStructure = (structure, level = 0, path = '/') => {
        if (!structure) return (
            <div>
                No directory tree
            </div>
        )
        if (typeof structure === 'string') {
            const extension = structure.split('.').reverse()[0]
            const nodePath = `${path}${structure}`
            
            return (
                <div
                    className={styles.EndNode}
                    style={{ marginLeft: level*10 }}
                    key={nodePath}
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
                    key={`nodeswrapper${path}`}
                >
                    {structure.map(node => this.renderDirStructure(node, level + 1, path))}
                </div>
            )
            tree.push(treePart)
        } else {
            for(const dirName in structure) {
                const subDir = structure[dirName]
                const nodePath = `${path}${dirName}/`
                
                const isDirExpanded = Boolean(this.state.expandedDirs.find(expandedNodePath => {
                    return expandedNodePath === nodePath
                }))
        
                const treePart =  (
                    <div key={nodePath}>
                        <div
                            className={styles.Directory}
                            style={{ marginLeft: level*10 }}
                        >
                            {isDirExpanded
                             ? this.renderCollapseSign(nodePath, level)
                             : this.renderExpandSign(nodePath, level)}
                             
                            {<img src={folderIcon} alt="" />}

                            <div
                                onContextMenu={(e) => this.handleContextMenuOpen(e, nodePath, dirName)}
                            >
                                {dirName}
                            </div>
                        </div>
                        {isDirExpanded
                         ? this.renderDirStructure(subDir, level + 1, nodePath)
                         : null}
                    </div>
                )
        
                tree.push(treePart)
            }
        }
        
        return tree;
    }
    
    renderCollapseSign = (nodePath) => {
        return (
            <img
                src={arrowUp}
                alt='Collapse'
                title='Collapse'
                onClick={() => this.handleCollapse(nodePath)}
            />
        )
    }
    
    renderExpandSign = (nodePath) => {
        return (
            <img
                src={arrowDown}
                alt='Expand'
                title='Expand'
                onClick={() => this.handleExpand(nodePath)}
            />
        )
    }
    
    renderContextMenu = (clientX, clientY) => {
        return <div ref={(el) => this.contextMenu = el}>Context</div>
    }
    
    hideContextMenu = () => {
        this.setState(() => ({
            contextMenu: {
                isOpen: false,
                clientX: null,
                clientY: null
            },
            editedNodeName: '',
            editedNodePath: ''
            })
        )
    }
    
    handleCollapse = (nodePath) => {
        const nextExpandedDirs = this.state.expandedDirs.filter(expandedNodePath => {
            return !expandedNodePath.includes(nodePath)
        })
        this.setState(() => ({ expandedDirs: nextExpandedDirs }))
    }
    
    handleExpand = (nodePath) => {
        this.setState((prevState) => ({ expandedDirs: [ ...prevState.expandedDirs, nodePath ] }))
    }
    
    handleContextMenuOpen = (e, nodePath, nodeName) => {
        e.persist()
        e.preventDefault()
        const { clientX, clientY } = e;
        console.log('EEE', e)
        this.setState(() => ({
            contextMenu: {
                isOpen: true,
                clientX,
                clientY
            },
            editedNodeName: nodeName,
            editedNodePath: nodePath
        }));
    
        document.addEventListener('click', this.handleDocumentClick);
    }
    
    handleDocumentClick = (event) => {
        if (!this.contextMenu.contains(event.target)) {
            this.hideContextMenu();
            document.removeEventListener('click', this.handleDocumentClick);
        }
    }
    
    render() {
        return (
            <div>
                {this.renderDirStructure(this.state.dirStructure)}
                {this.state.contextMenu.isOpen && this.renderContextMenu()}
            </div>
        )
    }
}
