import React from 'react'

import folderIcon from './assets/folder.svg'
import arrowUp from './assets/arrowUp.svg'
import arrowDown from './assets/arrowDown.svg'

import styles from './Submenu.css'


export default class Submenu extends React.PureComponent {
    submenu = null
    
    componentDidUpdate(prevState, prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            document.addEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleDocumentClick = (event) => {
        console.log('handleDocumentClick submenu')
        if (!this.submenu.contains(event.target)) {
            this.props.onClose()
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    render() {
        if (!this.props.isOpen) return null;
        
        return (
            <div
                ref={(el) => this.submenu = el}
                className={styles.Submenu}
                style={{
                    top: this.props.pageY,
                    left: this.props.pageX + 260
                }}
            >
                <div
                    onClick={this.props.onNewDirectory}
                >
                    Directory
                </div>
                
                <div
                    onClick={this.props.onNewFile}
                >
                    File
                </div>
                
            </div>
        )
    }
}
