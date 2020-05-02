import React from "react";
import {Bar} from 'react-chartjs-2';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    chart: {
        flexGrow: 1,
        width: "100%",
        paddingTop: 20,
        paddingBottom: 20
    },
}));

function BarChart() {
    const classes = useStyles();
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: "#63cdda",
                borderColor: "#63cdda",
                borderWidth: 1,
                hoverBackgroundColor: "#63cdda",
                hoverBorderColor: "#63cdda",
                data: [65, 59, 80, 81, 56, 55, 40],

            }
        ]
    };
    return (
        <div className={classes.chart}>
            <Bar
                data={data}
                width={100}
                height={50}
                options={{
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 15
                        }
                    },
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "white",
                                fontSize: 15,
                                stepSize: 20,
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "white",
                                fontSize: 15,
                                stepSize: 1,
                                beginAtZero: true
                            }
                        }]
                    }
                }}
            />
        </div>
    );
}
export default BarChart;
