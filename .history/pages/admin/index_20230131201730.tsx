import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Bar } from 'react-chartjs-2';

import { fetchGetJSON } from '@libs/utils/api-helpers';
import AdminscreenWrapper from '@components/Wrapper/AdminscreenWrapper'
import PrintObject from '@components/PrintObject';

interface SalesData {
    _id: string,
    totalSales: Number
}

type Summary = {
    data: {
        ordersCount: Number,
        productsCount: Number,
        usersCount: Number,
        ordersPrice: Number,
        salesData: SalesData[],
    },
    error: any
}

function AdminDashboardScreen() {

    const { data, error }: Summary = useSWR("/api/admin/summary", fetchGetJSON);

    const chartSalesData : SalesData = useMemo(() => {
        if(!data?.salesData || data.salesData.length === 0) return {
            label: 'Sales',
            backgroundColor: 'rgba(162, 222, 208, 1)',
            data: []
        }

        return {
            labels: data.salesData.map((x) => x._id), // 2022/01 2022/03
            datasets: [
                {
                    label: 'Sales',
                    backgroundColor: 'rgba(162, 222, 208, 1)',
                    data: data.salesData.map((x) => x.totalSales),
                },
            ],
        }
    }, [data]);;


    return (
        <AdminscreenWrapper title="Dashboard">
            <h1>DASHBOARD</h1>
            {
                !error &&  data.salesData.length > 0 &&(
                    <div>
                        <h2 className="text-xl">Sales Report</h2>
                        <Bar
                            options={{
                                legend: { display: true, position: 'right' },
                            }}
                            datasets={chartSalesData}
                        />
                    </div>
                )
            }

            <div className='grid grid-cols-4 gap-4'>
                <PrintObject title="orders Count" content={data.ordersCount ?? 'loading...'} />
                <PrintObject title="products Count" content={data.productsCount ?? 'loading...'} />
                <PrintObject title="users Count" content={data.usersCount ?? 'loading...'} />
                <PrintObject title="orders Price" content={data.ordersPrice ?? 'loading...'} />
                <PrintObject title="sales Data" content={data.salesData ?? 'loading...'} />
                <PrintObject title="error" content={error ?? 'loading...'} />
            </div>
        </AdminscreenWrapper>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen