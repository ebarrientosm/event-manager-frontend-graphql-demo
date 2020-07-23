import React from 'react'

const Modal = props => {
    return (
        <div className='shadow-5 pv5' >
            <header>{props.title}</header>
            <section id='content' >{props.children}</section>
            <section id='actions'>
                {props.canCancel && <button className='' onClick={props.onCancel} >Cancel</button>}
                {props.canConfirm && <button className='' onClick={props.onConfirm} >{props.confirmText}</button>}
            </section>
        </div>
    )
}

export default Modal