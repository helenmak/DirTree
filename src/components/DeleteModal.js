import React from 'react'
import Modal from '../shared/Modal'


export default class DeleteModal extends React.PureComponent {
    render() {
        const entityToDelete = this.props.isDir ? 'directory' : 'file'
        
        return (
            <Modal
                isOpen={this.props.isOpen}
                header={
                    <div>
                        Delete {entityToDelete} "{this.props.name}"?
                    </div>
                }
                footer={
                    <div>
                        <button onClick={this.props.onDelete}>
                           Ok
                        </button>
                        <button onClick={this.props.onCancel}>
                            Cancel
                        </button>
                    </div>
                }
            >
                {this.props.isDir && (
                    `All files and subdirectories in "${this.props.name}" will be deleted.
                    You might not be able to fully undo this operation.`
                )}
        </Modal>
        )
    }
}
