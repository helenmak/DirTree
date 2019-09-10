import React from 'react'

import styles from './Submenu.css'


export default class Submenu extends React.PureComponent {
    submenu = null
    
    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            document.addEventListener('click', this.handleDocumentClick)
        }

        if (prevProps.isOpen && !this.props.isOpen) {
            document.removeEventListener('click', this.handleDocumentClick)
        }
    }
    
    handleDocumentClick = (event) => {
        if (!this.submenu.contains(event.target)) {
            this.props.onClose()
            document.removeEventListener('click', this.handleDocumentClick)
        }
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
                    className={styles.SubmenuButton}
                    onClick={this.props.onNewFile}
                >
                    File
                </div>
                
                <div
                    className={styles.SubmenuButton}
                    onClick={this.props.onNewDirectory}
                >
                    Directory
                </div>
            </div>
        )
    }
}
