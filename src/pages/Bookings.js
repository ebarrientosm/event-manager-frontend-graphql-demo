import React, { Component } from 'react'
import axios from 'axios'

import AuthContext from '../components/context/authContext'
import BookingList from '../components/Bookings/BookingList'
import spinner from '../components/assets/spinner.svg'
import BookingsChart from '../components/Bookings/BookingsChart'

export default class Bookings extends Component {

    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    }

    static contextType = AuthContext

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {

        this.setState({ isLoading: true })
        
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        }

        const token = this.context.token;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        axios.post('http://localhost:4000/graphql', requestBody, config)
        .then( response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to fetch!');
            }
            return response;
        })
        .then( response => {
            const bookings = response.data.data.bookings
            this.setState({ bookings: bookings, isLoading: false })
        })
        .catch( error => {
            console.log(error)
        })
    }

    deleteBookingHandler = bookingId => {
        
        this.setState({ isLoading: true })
        
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking (bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        }

        const token = this.context.token;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        axios.post('http://localhost:4000/graphql', requestBody, config)
        .then( response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to fetch!');
            }
            return response;
        })
        .then( response => {
            this.setState( prevState => {

                console.log(response)
                
                const updatedBookings = prevState.bookings.filter( booking => {
                    return booking._id !== bookingId
                })

                return { bookings: updatedBookings, isLoading: false }
                
            })
        })
        .catch( error => {
            console.log(error)
            this.setState({ isLoading: false })
        })
    }

    changeOutputTypeHandler = outputType => {
        if (outputType === 'list') {
            this.setState({outputType: 'list'})
        } else {
            this.setState({outputType: 'chart'})
        }
    }

    render() {

        let content = <img src={spinner} alt='' />
        if( !this.state.isLoading ) {
            content = (
                <div>
                    <div>
                        <button className='ma2 br3 shadow-5' onClick={this.changeOutputTypeHandler.bind(this, 'list')} >List</button>
                        <button className='ma2 br3 shadow-5' onClick={this.changeOutputTypeHandler.bind(this, 'chart')} >Chart</button>
                    </div>
                    <div>
                        { 
                            this.state.outputType === 'list' ?
                                <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} /> :
                                <BookingsChart bookings={this.state.bookings} />
                            
                            
                        }
                    </div>
                </div>
            );
        }

        return (
            <div className='pv5'>
                <p className='f1 b' >Bookings</p>

                {content}


            </div>
        )
    }
}
