import React from 'react'

import { fetchDirectoryStructure } from './services/api'

import ExtensionToIcon from './ExtensionToIcon'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import ContextMenu from './ContextMenu'
import NewFileModal      from './components/NewFileModal'
import NewDirectoryModal from './components/NewDirectoryModal'
import DeleteModal from './components/DeleteModal'

import addFile             from './utils/addFile'
import checkDirectoryExist from './utils/checkDirectoryExist'
import checkFileExist      from './utils/checkFileExist'
import addDirectory        from './utils/addDirectory'
import deleteNode          from './utils/deleteNode'

import sortDirStructure from './utils/sortDirStructure'
import nodesSorter      from './utils/nodesSorter'

import styles           from './DirectoryTree.css'


//TODO: separate functions for render nodes, separate components from context menu

export default class DirectoryTree extends React.PureComponent {
    state = {
        dirStructure: null,
        expandedDirs: [],
        isContextMenuOpen: false,
        contextMenuPageX: null,
        contextMenuPageY: null,
        editedNodeName: '',
        editedNodeDirPath: '',
        isEditedNodeDir: false,
        isFileModalOpen: false,
        isDirectoryModalOpen: false,
        isDeleteModalOpen: false,
        newFileType: '',
    }
    
    async componentDidMount() {
        const dirStructure = await fetchDirectoryStructure();
        
        this.setState(() => ({ dirStructure: sortDirStructure(dirStructure, nodesSorter) }))
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
            const isDir = false
            
            return (
                <div
                    className={styles.FileWrapper}
                    style={{ marginLeft: level*10 }}
                    key={nodePath}
                    onContextMenu={(e) => this.handleContextMenuOpen(e, path, structure, isDir)}
                >
                    <img
                        className={styles.FileIcon}
                        src={require(`./assets/${ExtensionToIcon(extension)}`)}
                        alt=""
                    />
                    
                    <div className={styles.FileName}>
                        {structure}
                    </div>
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
                if (!structure.hasOwnProperty(dirName)) continue;
                const subDir = structure[dirName]
                const nodePath = `${path}${dirName}/`
                
                const isDirExpanded = Boolean(this.state.expandedDirs.find(expandedNodePath => {
                    return expandedNodePath === nodePath
                }))
    
                const isDir = true
        
                const treePart =  (
                    <div key={nodePath}>
                        <div
                            className={styles.DirectoryWrapper}
                            style={{ marginLeft: level*10 }}
                            onContextMenu={(e) => this.handleContextMenuOpen(e, nodePath, dirName, isDir)}
                        >
                            {isDirExpanded
                                 ? this.renderCollapseSign(nodePath)
                                 : this.renderExpandSign(nodePath)
                            }
                            
                            <img
                                className={styles.DirectoryIcon}
                                src={folderIcon}
                                alt=""
                            />

                            <div className={styles.DirectoryName}>
                                {dirName}
                            </div>
                        </div>
                        {isDirExpanded
                             ? this.renderDirStructure(subDir, level + 1, nodePath)
                             : null
                        }
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
                className={styles.ExpandIcon}
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
                className={styles.CollapseIcon}
                title='Expand'
                onClick={() => this.handleExpand(nodePath)}
            />
        )
    }
    
    
    handleCreateFile = (name) => {
        const { editedNodeDirPath, newFileType } = this.state
        
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
    
        const nodeExist = checkFileExist(nodeDirPathArr, prevDirStructure, fullFileName)
        if (!nodeExist) {
            newDirStructure = addFile(nodeDirPathArr, prevDirStructure, fullFileName)
            this.setState(() => ({ dirStructure: newDirStructure, isFileModalOpen: false }))
        } else {
            alert(`File ${fullFileName} exists`)
        }
    }
    
    handleCreateDirectory = (name) => {
        const nodeDirPathArr = this.state.editedNodeDirPath.split('/').filter(item => item)
        
        let prevDirStructure = JSON.parse(JSON.stringify(this.state.dirStructure))
        let newDirStructure = prevDirStructure
        
        const nodeExist = checkDirectoryExist(nodeDirPathArr, prevDirStructure, name)
        if (!nodeExist) {
            newDirStructure = addDirectory(nodeDirPathArr, prevDirStructure, name)
            this.setState(() => ({ dirStructure: newDirStructure, isDirectoryModalOpen: false  }))
        } else {
            alert(`Directory ${name} exists`)
        }
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
    
    handleNodeDelete = () => {
        const { editedNodeName, editedNodeDirPath } = this.state
    
        const nodeDirPathArr = editedNodeDirPath.split('/').filter(item => item)
    
        const prevDirStructure = JSON.parse(JSON.stringify(this.state.dirStructure))
        const newDirStructure = deleteNode(nodeDirPathArr, prevDirStructure, editedNodeName)
        
        this.setState(() => ({
            dirStructure: newDirStructure,
            isDeleteModalOpen: false,
            isEditedNodeDir: false,
            editedNodeName: '',
            editedNodeDirPath: ''
        }))
    }
    
    handleContextMenuOpen = (e, nodeDirPath, nodeName, isDir) => {
        e.persist()
        e.preventDefault()
        const { pageX, pageY } = e;
        
        this.setState(() => ({
            isContextMenuOpen: true,
            contextMenuPageX: pageX,
            contextMenuPageY: pageY,
            editedNodeName: nodeName,
            editedNodeDirPath: nodeDirPath,
            isEditedNodeDir: isDir
        }));
    }
    
    handleContextMenuClose = () => {
        this.setState(() => ({
                isContextMenuOpen: false,
                contextMenuPageX: null,
                contextMenuPageY: null
            })
        )
    }
    
    handleOpenNewDirectoryModal = () => {
        this.setState(() => ({ isDirectoryModalOpen: true }))
    }
    
    handleOpenNewFileModal = (newFileType = '') => {
        this.setState(() => ({
            isFileModalOpen: true,
            newFileType
        }))
    }
    
    handleOpenDeleteModal = () => {
        this.setState(() => ({ isDeleteModalOpen: true }))
    }
    
    handleDeleteModalCancel = () => {
        this.setState(() => ({
            isDeleteModalOpen: false,
            editedNodeDirPath: '',
            editedNodeName: '',
            isEditedNodeDir: false
        }))
    }
    
    handleCreateModalCancel = () => {
        this.setState(() => ({
            isDirectoryModalOpen: false,
            isFileModalOpen: false,
            newFileType: '',
            editedNodeDirPath: '',
            editedNodeName: '',
            isEditedNodeDir: false
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
                    onDelete={this.handleOpenDeleteModal}
                />
                <NewFileModal
                    isOpen={this.state.isFileModalOpen}
                    onCreate={this.handleCreateFile}
                    onCancel={this.handleCreateModalCancel}
                />
                
                <NewDirectoryModal
                    isOpen={this.state.isDirectoryModalOpen}
                    onCreate={this.handleCreateDirectory}
                    onCancel={this.handleCreateModalCancel}
                />
                
                <DeleteModal
                    isOpen={this.state.isDeleteModalOpen}
                    isDir={this.state.isEditedNodeDir}
                    name={this.state.editedNodeName}
                    onDelete={this.handleNodeDelete}
                    onCancel={this.handleDeleteModalCancel}
                />
                
            </div>
        )
    }
}
