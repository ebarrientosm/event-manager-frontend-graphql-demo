import React from 'react'

const EventItem = (props) => (
    <li key={props.eventId} className='ba br3 pa2 list shadow-5 mv3 grow' >
       <div className='pv3' >
            <p className='f3 mv0' >{props.title}</p>
            <p className='f5 mv2' >${props.price} - {new Date(props.date).toLocaleDateString()}</p>
        </div>
        <div className='pb3' >
            {props.userId === props.creatorId ? 
                <p className='f5 mv2' >You're the owner of this event.</p> : 
                <button onClick={props.onDetail.bind(this, props.eventId)} >View Details</button> 
            }
            
            
        </div>
    </li>
)

export default EventItem