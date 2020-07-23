import React from 'react'
import { Bar as BarChart } from 'react-chartjs'

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: 100000
    }
}

const BookingsChart = (props) => {

    const chartData = { labels: [], datasets: [] };

    let values = [];

    for( const bucket in BOOKINGS_BUCKETS ) {
        
        const filteredBookingsCount = props.bookings.reduce( (prev, current) => {
            if (current.event.price > BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1
            } else {
                return prev;
            }
        }, 0 );

        values.push(filteredBookingsCount);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            // label: '# of Votes',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        })
        values = [...values]
        values[values.length - 1] = 0
    
    }

    return <BarChart data={chartData} />
}

export default BookingsChart