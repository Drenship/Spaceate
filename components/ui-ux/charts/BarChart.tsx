import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: false
    },
};

type OptionsChart = any

interface Props {
    title: string,
    datasets: any
}

export default function BarChart({ title, datasets }: Props) {

    const optionsChart: OptionsChart = {
        plugins: {
            legend: false
        },
    }

    return (
        <div className='w-full max-w-lg'>
            <h2 className='font-semibold'>{title}</h2>
            <Bar
                options={optionsChart}
                data={datasets}
            />
        </div>
    );
}
