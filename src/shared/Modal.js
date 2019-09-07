import React from 'react';

import styles from './Modal.css'


export default class Modal extends React.PureComponent {
    render() {
        return (
            <div
                className={styles.Modal}
            >
                <div>
                    {this.props.header}
                </div>
                <div>
                    {this.props.children}
                </div>
                {this.props.footer !== null && (
                    <div>
                        {this.props.footer}
                    </div>
                )}
            </div>
        )
    }
}
