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
  };

  componentDidMount = () => {
    // const url =
    //   'https://cors-anywhere.herokuapp.com/http://benoitprost.synology.me:5031/temperatures';
    // axios.get(url).then(res => {
    //   const temperatures = res.data;
    //   this.setState({ temperatures });
    // });

    const temperatures = this.handleData(TEMP);
    this.setState({ temperatures });
  };

  handleData = data => {
    const newData = [];
    const temperature_average = {
      id: 'temperature_average',
      color: 'red',
      data: [],
    };
    const temperature_blue = {
      id: 'temperature_blue',
      color: 'blue',
      data: [],
    };
    const temperature_green = {
      id: 'temperature_green',
      color: 'green',
      data: [],
    };
    const temperature_yellow = {
      id: 'temperature_yellow',
      color: 'yellow',
      data: [],
    };
    data.forEach(d => {
      const time = new Date(d.date).getTime();
      temperature_average.data.push({ x: time, y: d.temperature_average });
      temperature_blue.data.push({ x: time, y: d.temperature_blue });
      temperature_green.data.push({ x: time, y: d.temperature_green });
      temperature_yellow.data.push({ x: time, y: d.temperature_yellow });
    });
    newData.push(temperature_average, temperature_blue, temperature_green, temperature_yellow);
    return newData;
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
            {/* <ResponsiveLine
              data={this.state.temperatures}
              margin={{
                top: 50,
                right: 110,
                bottom: 50,
                left: 60,
              }}
              xScale={{
                type: 'point',
              }}
              yScale={{
                type: 'linear',
                stacked: true,
                min: 'auto',
                max: 'auto',
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'transportation',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              dotSize={10}
              dotColor="inherit:darker(0.3)"
              dotBorderWidth={2}
              dotBorderColor="#ffffff"
              enableDotLabel={true}
              dotLabel="y"
              dotLabelYOffset={-12}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            /> */}
          </GraphContainer>
          <ReloadButtonContainer>
            <Fab color="secondary" aria-label="Reload">
              <CachedIcon />
            </Fab>
          </ReloadButtonContainer>
        </Container>
      </Page>
    );
  }
}

export default App;
