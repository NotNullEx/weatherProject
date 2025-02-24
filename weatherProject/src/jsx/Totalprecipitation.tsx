import React, { PureComponent } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 400,
        pv: 240,
        amt: 240,
    }
];

export default class Totalprecipitation extends PureComponent {
    static demoUrl = 'https://codesandbox.io/p/sandbox/tiny-bar-chart-xzyy8g';

    render() {
        return (
            <ResponsiveContainer height="20%">
                <BarChart width={150} height={90} data={data}>
                    <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
