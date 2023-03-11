import React from 'react';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

interface LineChartProps {
    title: string
    labels: string[]
    datasets: number[]
    ordonnee: string
}

LineChart.defaultProps = {
    title: "Chart",
    labels: ["May 12", "", "May 13", "", "May 14", "", "May 15", "", "May 16", "", "May 17", ""],
    datasets: [8, 10, 7.8, 4, 6, NaN, 13, 7, NaN, 6, 15, 5],
    ordonnee: '€'
}

export default function LineChart({ title, labels, datasets, ordonnee }: LineChartProps) {

    const skipped = (ctx: any, value: string | number[]) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
    const down = (ctx: any, value: string | number[]) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const getMinValue = () => Math.floor(Math.min(...datasets.filter((number) => !isNaN(number))) * 0.5)
    const getMaxValue = () => Math.ceil(Math.max(...datasets.filter((number) => !isNaN(number))) * 1.1)

    const data: any = {
        labels: labels,
        datasets: [{
            data: datasets,
            backgroundColor: 'transparent',
            borderColor: '#f26c6d',
            pointBorder: 'transparent',
            pointBorderWidth: 4,
            tension: 0.5,
            spanGaps: true,
            segment: {
                borderColor: (ctx: any) => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, '#f26c6d'),
                borderDash: (ctx: any) => skipped(ctx, [6, 6]),
            },
        }],
        options: {
            fill: false,
            interaction: {
                intersect: false
            },
            radius: 0,
        }
    }

    const options: any = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                },
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                min: getMinValue(),
                max: getMaxValue(),
                ticks: {
                    stepSize: 30,
                    callback: (value: string) => value + ordonnee
                },
                grid: {
                    borderDash: [10]
                }
            }
        }
    }

    return (
        <div className='w-full max-w-lg'>
            <h2 className='font-semibold'>{title}</h2>
            <Line data={data} options={options} />
        </div>
    );
}
