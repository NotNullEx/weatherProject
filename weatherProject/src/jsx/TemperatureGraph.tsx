import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: '1월', 최고: 5, 평균: 2, 최저: -2 },
    { name: '2월', 최고: 8, 평균: 3, 최저: 0 },
    { name: '3월', 최고: 12, 평균: 8, 최저: 4 },
    { name: '4월', 최고: 16, 평균: 12, 최저: 8 },
    { name: '5월', 최고: 22, 평균: 18, 최저: 14 },
    { name: '6월', 최고: 26, 평균: 22, 최저: 18 },
    { name: '7월', 최고: 30, 평균: 25, 최저: 21 },
    { name: '8월', 최고: 31, 평균: 26, 최저: 22 },
    { name: '9월', 최고: 27, 평균: 22, 최저: 18 },
    { name: '10월', 최고: 20, 평균: 14, 최저: 10 },
    { name: '11월', 최고: 13, 평균: 8, 최저: 3 },
    { name: '12월', 최고: 6, 평균: 2, 최저: -1 }
];
const TemperatureGraph = () => {
    return (
        <div className="temperatureGraph">
            <ResponsiveContainer width="110%" height={200}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="최고" stroke="#ff0000" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="평균" stroke="#007BFF" />
                    <Line type="monotone" dataKey="최저" stroke="#00FF00" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureGraph;