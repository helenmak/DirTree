import React from 'react'

import styles from './Input.css'


export default function renderInput(props) {
    const inputClassList = props.error ? `${styles.Input} ${styles.InputError}` : styles.Input
    const errorTooltipClassList = props.error ? styles.ErrorMsg : styles.Hidden
    
    return (
        <div className={styles.Wrapper}>
            <div className={errorTooltipClassList}>
                {props.error}
            </div>
            <input
                type="text"
                className={inputClassList}
                onChange={props.onChange}
            />
        </div>
    )
}
