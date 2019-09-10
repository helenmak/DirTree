import React from 'react';

import styles from './Modal.css'


export default class Modal extends React.PureComponent {
    render() {
        if (!this.props.isOpen) return null
        
        return (
            <div className={styles.Modal}>
                <div className={styles.ModalHeader}>
                    {this.props.title}
                </div>
                
                <div className={styles.ModalContent}>
                    {this.props.children}
                </div>
                
                <div>
                    <button
                        className={styles.ModalFooterBtn}
                        onClick={this.props.onOk}
                    >
                        {this.props.okText || 'Ok'}
                    </button>
                    <button
                        className={styles.ModalFooterBtn}
                        onClick={this.props.onCancel}
                    >
                        {this.props.cancelText || 'Cancel'}
                    </button>
                </div>
            </div>
        )
    }
}
