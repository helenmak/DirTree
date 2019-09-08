import React from 'react'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import styles from './Submenu.css'


export default class Submenu extends React.PureComponent {
    submenu = null
    
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            document.addEventListener('click', this.handleDocumentClick)
        }
        console.log('submenuDidUpdate', prevProps, this.props)
        if (prevProps.isOpen && !this.props.isOpen) {
            console.log('remove listener in did update')
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleDocumentClick = (event) => {
        if (!this.submenu.contains(event.target)) {
            this.props.onClose()
            console.log('remove listener in doc click')
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleNewFile = () => {
        this.props.onNewFile()
    }
    
    render() {
        const submenuClassName = styles.Submenu
        const classList = this.props.isOpen ? submenuClassName : `${submenuClassName} ${styles.Hidden}`
        
        return (
            <div
                ref={(el) => this.submenu = el}
                className={classList}
            >
                <div
                    onClick={this.props.onNewDirectory}
                >
                    Directory
                </div>
                
                <div
                    onClick={this.handleNewFile}
                >
                    File
                </div>
                
            </div>
        )
    }
}
