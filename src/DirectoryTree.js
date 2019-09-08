import React from 'react'

import { fetchDirectoryStructure } from './services/api'

import ExtensionToIcon from './ExtensionToIcon'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import styles      from './DirectoryTree.css'
import ContextMenu from './ContextMenu'
import Modal from './shared/Modal'

import addFile           from './utils/addFile'
import checkNodeExist    from './utils/checkNodeExist'
import addDirectory      from './utils/addDirectory'

import NewFileModal      from './components/NewFileModal'
import NewDirectoryModal from './components/NewDirectoryModal'



//TODO: separate functions for render nodes, separate components from context menu
//TODO: not to save dirstructure in state?
export default class DirectoryTree extends React.PureComponent {
    state = {
        dirStructure: null,
        expandedDirs: [],
        contextMenu: {
            isOpen: false,
            pageX: null,
            pageY: null
        },
        editedNodeName: '',
        editedNodeDirPath: '',
        isFileModalOpen: false,
        isDirectoryModalOpen: false,
        newFileType: '',
    }
    
    async componentDidMount() {
        const dirStructure = await fetchDirectoryStructure();
        
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
                    style={{ marginLeft: 10 }}
                    key={`nodeswrapper${path}`}
                >
                    {structure.map((node, index) => {
                        const nodePath = `${path}${index}/`
                        return this.renderDirStructure(node, level + 1, nodePath)
                    })}
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
    
    
    handleCreateFile = (name) => {
        const { editedNodeName, editedNodeDirPath, newFileType } = this.state
        
        let extension = newFileType ? `.${newFileType}`  : ''
        let fileName = name
        
        if (!extension) {
            const nameArr = fileName.split('.')
            const nameArrSize = nameArr.length

            if (nameArrSize > 1) {
                extension = `.${nameArr[nameArrSize - 1]}` // assume value after last dot is an extensions
                fileName = nameArr.slice(0, nameArrSize - 1).join('.')
            } else {
                fileName = nameArr[0]
            }
        }
        
        const fullFileName = `${fileName}${extension}`
        
        const nodeDirPathArr = editedNodeDirPath.split('/').filter(item => item)
    
        let prevDirStructure = JSON.parse(JSON.stringify(this.state.dirStructure))
        let newDirStructure = prevDirStructure
    
        const nodeExist = checkNodeExist(nodeDirPathArr, prevDirStructure, fullFileName)
        if (!nodeExist) {
            newDirStructure = addFile(nodeDirPathArr, prevDirStructure, fullFileName)
        } else {
            alert(`File ${fullFileName} exists`)
        }
        
        this.setState(() => ({ dirStructure: newDirStructure, isFileModalOpen: false }))
    }
    
    handleCreateDirectory = (name) => {
        const { editedNodeName, editedNodeDirPath } = this.state
        
        const nodeDirPathArr = editedNodeDirPath.split('/').filter(item => item)
        
        let prevDirStructure = JSON.parse(JSON.stringify(this.state.dirStructure))
        let newDirStructure = prevDirStructure
        
        const nodeExist = checkNodeExist(nodeDirPathArr, prevDirStructure, name)
        if (!nodeExist) {
            newDirStructure = addDirectory(nodeDirPathArr, prevDirStructure, name)
        } else {
            alert(`Directory ${name} exists`)
        }
        
        this.setState(() => ({ dirStructure: newDirStructure, isDirectoryModalOpen: false  }))
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
    
    handleContextMenuOpen = (e, nodeDirPath, nodeName) => {
        e.persist()
        e.preventDefault()
        const { pageX, pageY } = e;
        
        this.setState(() => ({
            isContextMenuOpen: true,
            contextMenuPageX: pageX,
            contextMenuPageY: pageY,
            editedNodeName: nodeName,
            editedNodeDirPath: nodeDirPath
        }));
    }
    
    handleContextMenuClose = () => {
        this.setState(() => ({
                isContextMenuOpen: false,
                contextMenuPageX: null,
                contextMenuPageY: null,
                editedNodeName: '',
                editedNodePath: ''
            })
        )
    }
    
    handleOpenNewDirectoryModal = () => {
        this.setState(() => ({
            isDirectoryModalOpen: true,
            isContextMenuOpen: false
        }))
    }
    
    handleOpenNewFileModal = (newFileType = '') => {
        this.setState(() => ({
            isFileModalOpen: true,
            newFileType,
            isContextMenuOpen: false
        }))
    }
    
    handleModalCancel = () => {
        this.setState(() => ({
            isDirectoryModalOpen: false,
            isFileModalOpen: false,
            newFileType: ''
        }))
    }
    
    render() {
        const { isContextMenuOpen, contextMenuPageX, contextMenuPageY } = this.state;
        
        return (
            <div className={styles.DirectoryTreeWrapper}>
                {this.renderDirStructure(this.state.dirStructure)}
                <ContextMenu
                    isOpen={isContextMenuOpen}
                    pageX={contextMenuPageX}
                    pageY={contextMenuPageY}
                    onClose={this.handleContextMenuClose}
                    onNewDirectory={this.handleOpenNewDirectoryModal}
                    onNewFile={this.handleOpenNewFileModal}
                />
                <NewFileModal
                    isOpen={this.state.isFileModalOpen}
                    onCreate={this.handleCreateFile}
                    onCancel={this.handleModalCancel}
                />
                
                <NewDirectoryModal
                    isOpen={this.state.isDirectoryModalOpen}
                    onCreate={this.handleCreateDirectory}
                    onCancel={this.handleModalCancel}
                />
                
            </div>
        )
    }
}
