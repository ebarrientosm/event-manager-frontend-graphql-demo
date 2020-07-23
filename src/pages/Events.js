import React, { Component } from 'react'
import axios from 'axios'

import AuthContext from '../components/context/authContext'
import Modal from '../components/Modal/Modal'
import EventList from '../components/Events/EventList'
import spinner from '../components/assets/spinner.svg'

export default class Events extends Component {

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }

    isActive = true

    static contextType = AuthContext; 

    constructor(props) {
        super(props);

        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false })

        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length === 0 ||
             price <= 0 ||
              date.trim().length === 0 ||
               description.trim().length === 0
        ) {
            return;
        }

        //this is the new content

        const requestBody = {
                query: `
                    mutation CreateEvent($title: String!, $description: String!, price: Float!, date: String!) {
                        createEvent( eventInput: {
                            title: $title, 
                            description: $description,
                            price: $price,
                            date: $date,
                        }) {
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
                `,
                variables: {
                    title: title,
                    description: description,
                    price: price,
                    date: date
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
                const updatedEvents = [...prevState.events];
                updatedEvents.push({ 
                    _id: response.data.data.createEvent._id,
                    title: response.data.data.createEvent.title,
                    description: response.data.data.createEvent.description,
                    price: response.data.data.createEvent.price,
                    date: response.data.data.createEvent.date,
                    creator: {
                        _id: this.context.userId
                    }
                 })
                return { events: updatedEvents };
            } )
        })
        .catch( error => {
            console.log(error)
        })

    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null })
    }

    fetchEvents = () => {

        this.setState({ isLoading: true })
        
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
    
        axios.post('http://localhost:4000/graphql', requestBody)
        .then( response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to fetch!');
            }
            // console.log(response.data)
            return response;
        })
        .then( response => {
            const events = response.data.data.events;
            if ( this.isActive ) {
                this.setState({ events: events, isLoading: false })
            }
        } )
        .catch( error => {
            console.log(error)
            if ( this.isActive ) {
                this.setState({ isLoading: false })
            }
        })
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(event => event._id === eventId)
            return { selectedEvent: selectedEvent }
        })
    }

    bookEventHandler = () => {

        if (!this.context.token) {
            this.setState({ selectedEvent: null })
            return;
        }

        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id ) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `, variables: {
                id: this.state.selectedEvent._id
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
            console.log(response)
            this.setState({ selectedEvent: null })
        })
        .catch( error => {
            console.log(error)
        })
    }

    componentWillUnmount() {
        this.isActive = false
    }

    render() {

        return (
            <div className='tc center w-90 w-80-m w-50-l' >
                <p className='f1 b pv5' >Events Page</p>
                { this.state.creating === true && <Modal title='Add Event' confirmText='Confirm' canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} >
                    <article className="pa4 black-80">
                        <form className='w-90 w-80-m w-50-l center' action="sign-up_submit" method="get" acceptCharset="utf-8">
                            <legend className="ph0 mh0 fw6 clip">Sign Up</legend>
                            <div className="mt3">
                                <label className="db fw4 lh-copy f6" htmlFor="title">Title</label>
                                <input className="pa2 input-reset ba bg-transparent w-100" type="text" name="title"  id="title" ref={this.titleElRef} />
                            </div>
                            <div className="mt3">
                                <label className="db fw4 lh-copy f6" htmlFor="price">Price</label>
                                <input className="b pa2 input-reset ba bg-transparent w-100" type="number" name="price"  id="price" ref={this.priceElRef} />
                            </div>
                            <div className="mt3">
                                <label className="db fw4 lh-copy f6" htmlFor="date">Date</label>
                                <input className="b pa2 input-reset ba bg-transparent w-100" type="datetime-local" name="date"  id="date" ref={this.dateElRef} />
                            </div>
                            <div className="mt3">
                                <label className="db fw4 lh-copy f6" htmlFor="description">Description</label>
                                <textarea className="b pa2 input-reset ba bg-transparent w-100" name="description"  id="description" ref={this.descriptionElRef} />
                            </div>
                        </form>
                    </article>
                </Modal>}

                { this.state.selectedEvent && <Modal 
                        // title={this.state.selectedEvent.title} 
                        onCancel={this.modalCancelHandler} 
                        onConfirm={this.bookEventHandler} 
                        confirmText={this.context.token? 'Book' : 'Confirm'}
                        canCancel 
                        canConfirm 
                    >
                        <p>{this.state.selectedEvent.title}</p>
                        <p className='f5 mv2' >${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</p>
                        <p className='f5 mv2' >{this.state.selectedEvent.description}</p>
                    </Modal> 
                }
                
                { this.context.token && <div>
                    <p>Share your own Events!</p>
                    <button className='br3' onClick={() => { this.setState({ creating: true }) }} >Create Event</button>
                </div>}

                { this.state.isLoading ? 
                    <img src={spinner} alt='' /> :
                    <EventList 
                        events={this.state.events} 
                        authUserId={this.context.userId} 
                        onViewDetail={this.showDetailHandler}
                    /> 
                }


            </div>
        )
    }
}
