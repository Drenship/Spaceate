import React, { useEffect, useReducer } from 'react';
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

import Link from 'next/link';
import axios from 'axios';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'

type SalesData = {
    _id: string,
    totalSales: number
}

type Summary = {
    data: {
        ordersCount: number,
        productsCount: number,
        usersCount: number,
        ordersPrice: number,
        salesData: SalesData[],
    },
    error: any
}

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
        legend: {
            position: 'top',
        },
    },
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, summary: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            state;
    }
}

function AdminDashboardScreen() {

    const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
        loading: true,
        summary: { salesData: [] },
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/summary`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err });
            }
        };

        fetchData();
    }, []);

    const data = {
        labels: summary.salesData.map((x: SalesData) => x._id), // 2022/01 2022/03
        datasets: [
            {
                label: 'Sales',
                backgroundColor: 'rgba(162, 222, 208, 1)',
                data: summary.salesData.map((x: SalesData) => x.totalSales),
            },
        ],
    };


    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>

            <div className="md:col-span-3">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4">
                            <div className="p-5 m-5 card">
                                <p className="text-3xl">${summary.ordersPrice} </p>
                                <p>Sales</p>
                                <Link href="/admin/orders">View sales</Link>
                            </div>
                            <div className="p-5 m-5 card">
                                <p className="text-3xl">{summary.ordersCount} </p>
                                <p>Orders</p>
                                <Link href="/admin/orders">View orders</Link>
                            </div>
                            <div className="p-5 m-5 card">
                                <p className="text-3xl">{summary.productsCount} </p>
                                <p>Products</p>
                                <Link href="/admin/products">View products</Link>
                            </div>
                            <div className="p-5 m-5 card">
                                <p className="text-3xl">{summary.usersCount} </p>
                                <p>Users</p>
                                <Link href="/admin/users">View users</Link>
                            </div>
                        </div>
                        <h2 className="text-xl">Sales Report</h2>
                        <Bar
                            options={{
                                legend: { display: true, position: 'right' },
                            }}
                            data={data}
                        />
                    </div>
                )}
            </div>
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen
