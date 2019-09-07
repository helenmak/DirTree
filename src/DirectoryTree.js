import React from 'react'

import { fetchDirectoryStructure } from './services/api'

import ExtensionToIcon from './ExtensionToIcon'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import styles      from './DirectoryTree.css'
import ContextMenu from './ContextMenu'
import Modal from './shared/Modal'

import addNode from './utils/addNode'


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
        modal: {
            isOpen: false,
            mode: 'directory',
        },
        newFileType: '',
        newNodeName: ''
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
                    style={{ marginLeft: level*10 }}
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
    
    renderModalHeader = (modalData) => {
        const { mode, fileType } = modalData;
        
        return mode === 'directory'
           ? (
                <div>
                    New directory
                </div>
            )
           : (
               <div>
                   {fileType ? `New ${fileType} file` : 'New file'}
               </div>
            )
    }
    
    renderModalFooter = (modalData) => {
        return (
           <div>
               <button
                   onClick={this.handleCreateNode}
               >
                   Ok
               </button>
                <button>
                    Cancel
                </button>
           </div>
        )
    }
    
    
    handleCreateNode = () => {
        const { editedDirName, editedNodeDirPath, modal : { mode }, newNodeName, newFileType } = this.state;
        
        const extension = newFileType ? `.${newFileType}`  : '';
        const nodeFullName = `${newNodeName}${extension}`
        
        const nodeDirPathArr = editedNodeDirPath.split('/').filter(item => item);
        
        this.setState((prevState) => {
            console.log('nodeDirPathArr', nodeDirPathArr)
            let dirStructure = JSON.parse(JSON.stringify(prevState.dirStructure))
            
            dirStructure = addNode(nodeDirPathArr, dirStructure, nodeFullName)
            console.log('dirStructure SET', nodeDirPathArr, dirStructure)
            
            return { dirStructure }
        })
        
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
        console.log('EEE', e)
        this.setState(() => ({
            contextMenu: {
                isOpen: true,
                pageX,
                pageY
            },
            editedNodeName: nodeName,
            editedNodeDirPath: nodeDirPath
        }));
    }
    
    handleContextMenuClose = () => {
        this.setState(() => ({
                contextMenu: {
                    isOpen: false,
                    pageX: null,
                    pageY: null
                },
                editedNodeName: '',
                editedNodePath: ''
            })
        )
    }
    
    handleOpenNewDirectoryModal = () => {
        this.setState(() => ({
            modal: {
                isOpen: true,
                mode: 'directory'
            }
        }))
    }
    
    handleOpenNewFileModal = (newFileType = '') => {
        this.setState(() => ({
            modal: {
                isOpen: true,
                mode: 'file'
            },
            newFileType
        }))
    }
    
    handleNewNodeNameChange = (e) => {
        const name = e.target.value;
        
        this.setState(() => ({ newNodeName: name }))
    }
    
    render() {
        const {modal, contextMenu} = this.state;
        
        return (
            <div className={styles.DirectoryTreeWrapper}>
                {this.renderDirStructure(this.state.dirStructure)}
                <ContextMenu
                    isOpen={contextMenu.isOpen}
                    pageX={contextMenu.pageX}
                    pageY={contextMenu.pageY}
                    onClose={this.handleContextMenuClose}
                    onNewDirectory={this.handleOpenNewDirectoryModal}
                    onNewFile={this.handleOpenNewFileModal}
                />
                <Modal
                    isOpen={modal.isOpen}
                    header={this.renderModalHeader(this.state.modal)}
                    footer={this.renderModalFooter(this.state.modal)}
                >
                    <input
                        type="text"
                        onChange={this.handleNewNodeNameChange}
                    />
                </Modal>
            </div>
        )
    }
}
