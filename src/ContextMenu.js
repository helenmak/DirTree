import React from 'react'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import Submenu from './Submenu'

import styles from './ContextMenu.css'


//TODO: separate functions for render nodes, separate components from context menu
export default class ContextMenu extends React.PureComponent {
    state = {
        isNewSubmenuOpen: false
    }
    
    contextMenu = null
    
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            document.addEventListener('click', this.handleDocumentClick)
        }
        console.log('menuDidUpdate', prevProps, this.props)
        
        if (prevProps.isOpen && !this.props.isOpen) {
            console.log('close submenu')
            this.setState(() => ({ isNewSubmenuOpen: false }))
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleDocumentClick = (event) => {
        if (!this.contextMenu.contains(event.target)) {
            this.setState(() => ({ isNewSubmenuOpen: false }))
            this.props.onClose()
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleSubmenuOpen = () => {
        this.setState(() => ({ isNewSubmenuOpen: true }))
    }
    
    handleSubmenuClose = () => {
        this.setState(() => ({ isNewSubmenuOpen: false }))
    }
    
    render() {
        const menuClassName = styles.ContextMenu
        const classList = this.props.isOpen ? menuClassName : `${menuClassName} ${styles.Hidden}`
    
        return (
            <div
                ref={(el) => this.contextMenu = el}
                className={classList}
                style={{
                    top: this.props.pageY,
                    left: this.props.pageX
                }}
            >
                <div
                    onClick={this.handleSubmenuOpen}
                >
                    New
                </div>
                
                <div>
                    Delete
                </div>
                
                <Submenu
                    isOpen={this.state.isNewSubmenuOpen}
                    onNewDirectory={this.props.onNewDirectory}
                    onNewFile={this.props.onNewFile}
                    onClose={this.handleSubmenuClose}
                />
            </div>
        )
    }
}
