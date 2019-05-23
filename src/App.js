import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      endpoint: "http://localhost:4000" // เชื่อมต่อไปยัง url ของ realtime server
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
    // const data = [
    //   { name: 1, count: 13000 },
    //   { name: 2, count: 16500 },
    //   { name: 3, count: 14250 },
    //   { name: 4, count: 19000 }
    // ]

    const { message } = this.state
    const data = [{ name: 'jennis', count: 0 }, { name: 'cherprang', count: 0 }]
    message.forEach(m => {
      if (m && m.toLowerCase().includes('jennis'))
        data[0].count++
      if (m && m.toLowerCase().includes('cherprang'))
        data[1].count++
    })

    return (
      <div>
        <div>
          <VictoryChart
            // adding the material theme provided with Victory
            theme={VictoryTheme.material}
            domainPadding={20}
            height={200}
            width={100}
          >
            <VictoryAxis
              tickFormat={(x) => x}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => x}
            />
            <VictoryBar
              data={data}
              x="name"
              y="count"
            />
          </VictoryChart>
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