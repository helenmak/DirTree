import React from 'react'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import NewSubmenu from './NewSubmenu'

import styles from './ContextMenu.css'


//TODO: separate functions for render nodes, separate components from context menu
export default class ContextMenu extends React.PureComponent {
    state = {
        isNewSubmenuOpen: false
    }
    
    contextMenu = null
    
    componentDidUpdate(prevState, prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            document.addEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleDocumentClick = (event) => {
        console.log('handleDocumentClick')
        if (!this.contextMenu.contains(event.target)) {
            this.props.onClose()
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleNewClick = () => {
        this.setState(() => ({ isNewSubmenuOpen: true }))
    }
    
    render() {
        if (!this.props.isOpen) return null;
        
        return (
            <div
                ref={(el) => this.contextMenu = el}
                className={styles.ContextMenu}
                style={{
                    top: this.props.pageY,
                    left: this.props.pageX
                }}
            >
                <div
                    onClick={this.handleNewClick}
                >
                    New
                </div>
                
                <div>
                    Delete
                </div>
                
                <NewSubmenu
                    onNewDirectory={this.props.onNewDirectory}
                    onNewFile={this.props.onNewFile}
                />
            </div>
        )
    }
}
