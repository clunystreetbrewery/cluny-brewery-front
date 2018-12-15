import React, { Component } from 'react';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { ResponsiveLine } from '@nivo/line';
import TEMP from './data.js';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import CachedIcon from '@material-ui/icons/Cached';
import AppBar from '@material-ui/core/AppBar';
// import axios from 'axios';

const Page = styled.div`
  background-color: whitesmoke;
`;

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
`;

const Title = styled.div`
  font-size: 5vh;
  font-weight: bold;
  margin: 3vh;
`;

const GraphContainer = styled(Card)`
  margin: 2em;
  width: 90vw;
  height: 75vh;
`;

const ReloadButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 3vh;
`;

class App extends Component {
  state = {
    temperatures: {},
    xMax: 0,
    xMin: 100,
  };

  componentDidMount = () => this.loadData();

  handleData = data => {
    let xMin = this.state.xMin;
    let xMax = this.state.xMax;
    const temperatures = [];
    const temperature_average = {
      id: 'temperature_average',
      label: 'Average',
      color: 'red',
      data: [],
    };
    const temperature_blue = {
      id: 'temperature_blue',
      label: 'Blue',
      color: 'hsl(191, 70%, 50%)',
      data: [],
    };
    const temperature_green = {
      id: 'temperature_green',
      label: 'Green',
      color: 'green',
      data: [],
    };
    const temperature_yellow = {
      id: 'temperature_yellow',
      label: 'Yellow',
      color: 'yellow',
      data: [],
    };
    data.forEach(d => {
      const time = new Date(d.date).toLocaleString();
      if (d.temperature_average < xMin) xMin = d.temperature_average;
      if (d.temperature_average > xMax) xMax = d.temperature_average;
      temperature_average.data.push({ x: time, y: d.temperature_average.toFixed(2) });
      temperature_blue.data.push({ x: time, y: d.temperature_blue.toFixed(2) });
      temperature_green.data.push({ x: time, y: d.temperature_green.toFixed(2) });
      temperature_yellow.data.push({ x: time, y: d.temperature_yellow.toFixed(2) });
    });
    temperatures.push(temperature_blue, temperature_green, temperature_yellow, temperature_average);
    return { temperatures, xMax, xMin };
  };

  loadData = () => {
    // const url =
    //   'https://cors-anywhere.herokuapp.com/http://benoitprost.synology.me:5031/temperatures';
    // axios.get(url).then(res => {
    //   const temperatures = this.handleData(res.data);
    //   this.setState({ temperatures });
    // });

    const { temperatures, xMax, xMin } = this.handleData(TEMP);
    console.log({ temperatures, xMax, xMin });
    this.setState({ temperatures, xMin, xMax });
  };

  renderAxisBottom = data => {
    const axisBottom = [];
    const daysData = data[0].data;
    // only keep 31 ticks in the bottom axis
    daysData.forEach((val, index) => {
      if (index % Math.ceil(daysData.length / 32) === 0) axisBottom.push(val.x);
    });
    return axisBottom;
  };

  render() {
    return (
      <Page>
        <GlobalStyle />
        <Container>
          <AppBar color="primary" position="relative">
            <Title>Cluny Street Brewery</Title>
          </AppBar>
          <GraphContainer>
            {this.state.temperatures.length > 0 && (
              <ResponsiveLine
                curve="natural"
                minY="auto"
                colors={['royalblue', 'forestgreen', 'gold', 'tomato']}
                margin={{
                  top: 20,
                  right: 50,
                  bottom: 100,
                  left: 80,
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'temperatures',
                  legendOffset: -50,
                  legendPosition: 'middle',
                }}
                yScale={{
                  type: 'linear',
                  stacked: false,
                  min: this.state.xMin - 2,
                  max: this.state.xMax + 2,
                }}
                axisBottom={{
                  tickRotation: -45,
                  tickValues: this.renderAxisBottom(this.state.temperatures),
                }}
                data={this.state.temperatures}
              />
            )}
          </GraphContainer>
          <ReloadButtonContainer>
            <Fab color="secondary" aria-label="Reload" onClick={this.loadData}>
              <CachedIcon />
            </Fab>
          </ReloadButtonContainer>
        </Container>
      </Page>
    );
  }
}

export default App;
