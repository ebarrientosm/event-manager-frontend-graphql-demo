import React from 'react'

const BookingList = props => {
    return (
        <ul className='pv4 ba br3 shadow-5 ph0 w-90 w-80-m w-70-l center' >
            {props.bookings.map(booking => {
                return (
                    <li key={booking._id} className='pv3 list ba br3 w-90 center tc' >
                        <div>
                            {booking.event.title} -{' '} 
                            {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <button className='br3 bg-transparent shadow-3 mv2' onClick={props.onDelete.bind(this, booking._id)} >Cancel</button>
                        
                    </li>
                )
            })}
        </ul>
    )
}

export default BookingList