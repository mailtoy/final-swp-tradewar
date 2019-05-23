import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  // Line,
  // LineChart,
} from 'recharts'

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      endpoint: "34.66.158.151" // เชื่อมต่อไปยัง url ของ realtime server
    }
  }

  componentDidMount = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new-message', (messageNew) => {
      temp.push(messageNew)
      this.setState({ message: temp })
    })
  }

  render() {
    const { message } = this.state
    const data = []
    message.forEach(m => {
      // if (m && m.toLowerCase().includes('#')) {
      //   const hashtags = m.split('#')
      //   if (!hashtags[1].includes('BNK48'))
      //     return
      //   const name = hashtags[1].split('BNK48')[0]
      //   if (!name)
      //     return
      //   const findData = data.find(d => d.name === name)
      //   if (findData) {
      //     findData.count++
      //   } else {
      //     data.push({ name, count: 1 })
      //   }
      // }
      if (m && m.toLowerCase().includes('#')) {
        const hashtags = m.split('#')
        if (!hashtags[1].includes('tradwar'))
          return
        const name = hashtags[1]
        const findData = data.find(d => d.name === name)
        if (findData) {
          findData.count++
        } 
      }
    })

    return (
      <div>
        <div>
          <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          {/* <LineChart width={400} height={400} data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart> */}
        </div>
        <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {data}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App