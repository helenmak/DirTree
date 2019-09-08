import React from 'react'

import arrowRight from './assets/arrowRight.svg'

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
        
        if (prevProps.isOpen && !this.props.isOpen) {
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
    
    handleDelete = () => {
        this.props.onDelete()
        this.props.onClose()
    }
    
    handleNewDirectory = () => {
        this.props.onNewDirectory()
        this.props.onClose()
    }
    
    handleNewFile = () => {
        this.props.onNewFile()
        this.props.onClose()
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
                    className={`${styles.MenuButton} ${styles.NewButton}`}
                    onClick={this.handleSubmenuOpen}
                >
                    New
                    <img
                        src={arrowRight}
                        alt=""
                        className={styles.MenuButton}
                    />
                </div>
                
                <div className={styles.Divider} />
                
                <div
                    className={styles.MenuButton}
                    onClick={this.handleDelete}
                >
                    Delete
                </div>
                
                <Submenu
                    isOpen={this.state.isNewSubmenuOpen}
                    onNewDirectory={this.handleNewDirectory}
                    onNewFile={this.handleNewFile}
                    onClose={this.handleSubmenuClose}
                />
            </div>
        )
    }
}
