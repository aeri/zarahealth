import React from "react";
import {Pie} from 'react-chartjs-2';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    chart: {
        flexGrow: 1,
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20
    },
}));

function PieChart() {
    const classes = useStyles();
    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            data: [300, 50, 100],
            borderColor: "rgba(0,0,0,0)",
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
        }]
    };
    return (
        <div className={classes.chart}>
            <Pie
                data={data}
                width={100}
                height={50}
                options={{
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 15
                        }
                    }}}/>
        </div>
    );
}
export default PieChart;
