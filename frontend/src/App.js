import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip,
  Legend
} from 'recharts'
import moment from 'moment'

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      endpoint: "104.197.98.78" // เชื่อมต่อไปยัง url ของ realtime server
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
      // data.push({ name: name, count: 1 })
      // var res = name.substring(0, 4);
      const name = moment(m.created_at).format('DD-MM-YYYY HH:mm')
      let found = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          data[i].count++
          found = true
          break
        }
      }
      if (!found) {
        data.push({ name: name, count: 1 })
      }
    })

    return (
      <div>
        <div>
          <LineChart width={1200} height={400} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="red" />
          </LineChart>
        </div>
        <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {data.text}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App