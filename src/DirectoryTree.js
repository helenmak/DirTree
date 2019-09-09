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
        newFileName: '',
        newDirectoryName: '',
        createFileError: '',
        createDirectoryError: ''
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
                
                const isDirEmpty = subDir.length === 0
    
                const isDir = true
        
                const treePart =  (
                    <div key={nodePath}>
                        <div
                            className={styles.DirectoryWrapper}
                            style={{ marginLeft: level*10 }}
                            onContextMenu={(e) => this.handleContextMenuOpen(e, nodePath, dirName, isDir)}
                        >
                            {this.renderDirectoryControls(isDirEmpty, isDirExpanded, nodePath)}
                            
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
    
    renderDirectoryControls = (isEmpty, isExpanded, nodePath) => {
        if (isEmpty) return null
        
        return isExpanded
             ? this.renderCollapseSign(nodePath)
             : this.renderExpandSign(nodePath)
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
    
    
    handleCreateFile = () => {
        const { newFileName } = this.state
    
        if (!newFileName) {
            this.setState(() => ({ createFileError: 'File name can not be empty' }))
            return
        }
        
        const { editedNodeDirPath, newFileType } = this.state
        
        let extension = newFileType ? `.${newFileType}`  : ''
        let fileName = newFileName
        
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
    
        const nodeExist = checkFileExist(nodeDirPathArr, prevDirStructure, fullFileName)
        
        if (nodeExist) {
            this.setState(() => ({ createFileError: 'File already exists' }))
            return
        }
        
        let newDirStructure = addFile(nodeDirPathArr, prevDirStructure, fullFileName)
        this.setState(() => ({
            dirStructure: newDirStructure,
            isFileModalOpen: false,
            newFileType: '',
            newFileName: ''
        }))
    }
    
    handleCreateDirectory = () => {
        const { newDirectoryName } = this.state
        
        if (!newDirectoryName) {
            this.setState(() => ({ createDirectoryError: 'Directory name can not be empty' }))
            return
        }
        
        const nodeDirPathArr = this.state.editedNodeDirPath.split('/').filter(item => item)
        
        let prevDirStructure = JSON.parse(JSON.stringify(this.state.dirStructure))
        
        const nodeExist = checkDirectoryExist(nodeDirPathArr, prevDirStructure, newDirectoryName)
        
        if (nodeExist) {
            this.setState(() => ({ createDirectoryError: 'Directory already exists' }))
            return
        }
    
        let newDirStructure = addDirectory(nodeDirPathArr, prevDirStructure, newDirectoryName)
        this.setState(() => ({
            dirStructure: newDirStructure,
            isDirectoryModalOpen: false,
            newDirectoryName: ''
        }))
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
            isEditedNodeDir: false,
            newFileName: '',
            newDirectoryName: ''
        }))
    }
    
    handleFileModalChange = e => {
        const name = e.target.value
        
        this.setState(() => ({ newFileName: name, createFileError: '' }))
    }
    
    handleDirectoryModalChange = e => {
        const name = e.target.value
        
        this.setState(() => ({ newDirectoryName: name, createDirectoryError: '' }))
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
                    title='New file'
                    onChange={this.handleFileModalChange}
                    onOk={this.handleCreateFile}
                    onCancel={this.handleCreateModalCancel}
                    error={this.state.createFileError}
                />
                
                <NewDirectoryModal
                    isOpen={this.state.isDirectoryModalOpen}
                    title='New directory'
                    onChange={this.handleDirectoryModalChange}
                    onOk={this.handleCreateDirectory}
                    onCancel={this.handleCreateModalCancel}
                    error={this.state.createDirectoryError}
                />
                
                <DeleteModal
                    isOpen={this.state.isDeleteModalOpen}
                    isDir={this.state.isEditedNodeDir}
                    name={this.state.editedNodeName}
                    onOk={this.handleNodeDelete}
                    onCancel={this.handleDeleteModalCancel}
                />
                
            </div>
        )
    }
}
