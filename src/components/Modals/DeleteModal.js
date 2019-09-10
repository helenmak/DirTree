import React from 'react'
import Modal from '../../shared/Modal/Modal'


export default class DeleteModal extends React.PureComponent {
    render() {
        const entityToDelete = this.props.isDir ? 'directory' : 'file'
        
        return (
            <Modal
                isOpen={this.props.isOpen}
                title={`Delete ${entityToDelete} "${this.props.name}"?`}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
            >
                {this.props.isDir && (
                    `All files and subdirectories in "${this.props.name}" will be deleted.
                    You might not be able to fully undo this operation.`
                )}
        </Modal>
        )
    }
}
