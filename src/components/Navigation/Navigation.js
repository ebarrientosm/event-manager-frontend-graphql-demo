import React from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';

const Navigation = () => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <div className='bg-dark-blue pv3 fixed w-100 top-0' >
                        <div className='w-90 center flex justify-between' >
                            <div>
                                <Link to='/' className='link f2 mv0 b white' >EasyEvent</Link>
                            </div>
                            <div className='flex flex-wrap' >
                                { !context.token && (<Link className='link white mh2 pv2 dim' to='auth' >Authenticate</Link>)}
                                { context.token && (<Link className='link white mh2 pv2 dim' to='/bookings' >Bookings</Link>)}
                                <Link className='link white mh2 pv2 dim' to='/events' >Events</Link>
                                { context.token && (<Link onClick={context.logout} className='link white mh2 pv2 dim' to='/auth' >Logout</Link>)}

                            </div>
                        </div>
                    </div>
                )
            }}
        </AuthContext.Consumer>
    )
}

export default Navigation;