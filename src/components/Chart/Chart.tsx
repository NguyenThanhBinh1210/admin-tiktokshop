/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useQuery } from 'react-query'
import { getMoneyByWeek } from '~/apis/purchase.api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    title: {
      display: true,
      text: 'Biểu đồ'
    }
  }
}

const labels = ['Mon', 'Tue', 'Wed', 'Wed', 'Fri', 'Sat', 'Sun']

export function Chart() {
  const { data: money } = useQuery({
    queryKey: ['get-money'],
    queryFn: () => {
      return getMoneyByWeek()
    }
  })
  const moneyOnWeek = money?.data.data.map((item: any) => {
    return item.price
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: moneyOnWeek,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }
  return <Line options={options} data={data} />
}
