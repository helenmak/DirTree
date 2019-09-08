import React from 'react'
import Modal from '../shared/Modal'


export default class NewFileModal extends React.PureComponent {
    state = {
        name: ''
    }
    
    handleNameChange = e => {
        const name = e.target.value;
    
        this.setState(() => ({ name }))
    }
    
    handleCreate = () => {
        this.props.onCreate(this.state.name)
    }
    
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                header={
                    <div>
                        New file
                    </div>
                }
                footer={
                    <div>
                        <button onClick={this.handleCreate}>
                           Ok
                        </button>
                        <button onClick={this.props.onCancel}>
                            Cancel
                        </button>
                    </div>
                }
            >
                <input
                    type="text"
                    onChange={this.handleNameChange}
                />
        </Modal>
        )
    }
}
