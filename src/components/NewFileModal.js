import React from 'react'

import Modal from '../shared/Modal'
import Input from '../shared/Input'


export default class NewFileModal extends React.PureComponent {
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                title={this.props.title}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
            >
                <Input
                    type="text"
                    error={this.props.error}
                    onChange={this.props.onChange}
                />
            </Modal>
        )
    }
}
