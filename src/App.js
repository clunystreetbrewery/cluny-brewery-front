import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';

import { ResponsiveLine } from '@nivo/line';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import CachedIcon from '@material-ui/icons/Cached';
import AppBar from '@material-ui/core/AppBar';
import ErrorOutlined from '@material-ui/icons/ErrorOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import { timeFormat } from 'd3-time-format';

import GlobalStyle from './GlobalStyle';
import LastTemperatures from './LastTemperatures';



const timeFormatDef = "%Y-%m-%d %H:%M:%S"
const timeFormatNew = timeFormat(timeFormatDef);



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
`;

const Title = styled.div`
  font-size: 5vh;
  font-weight: bold;
  margin: 3vh;
`;

const GraphCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em;
  width: 90vw;
  height: 75vh;

  @media (max-width: 700px) {
    display: none;
  }
`;

const ReloadButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 3vh;
`;

const ErrorContainer = styled.div`
  color: firebrick;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperatures, setTemperatures] = useState([]);
  const [xMax, setXMax] = useState(0);
  const [xMin, setXMin] = useState(100);
  const [lastId, setLastId] = useState(0);

  useEffect(() => loadData(), []);

  const handleData = (data) => {
    let max = xMax;
    let min = xMin;
    let last = lastId;
    const newTemperatures = [];
    const temperature_blue = {
      id: 'Blue',
      data: [],
    };
    const temperature_green = {
      id: 'Green',
      data: [],
    };
    const temperature_yellow = {
      id: 'Yellow',
      data: [],
    };

    data.forEach((d) => {
      if (d.temperature_blue < min) min = d.temperature_blue;
      if (d.temperature_blue > max) max = d.temperature_yellow;
      if (last < d.id) last = d.id;

      temperature_blue.data.push({
        x: d.date,
        y: d.temperature_blue.toFixed(2),
      });
      temperature_green.data.push({
        x: d.date,
        y: d.temperature_green.toFixed(2),
      });
      temperature_yellow.data.push({
        x: d.date,
        y: d.temperature_yellow.toFixed(2),
      });
    });
    newTemperatures.push(temperature_blue, temperature_green, temperature_yellow);
    return { newTemperatures, max, min, last };
  };

  const loadData = () => {
  	const dayRange = 3;

    setLoading(true);
    setError(false);
    var today = new Date(Date.now());
    var firstDate = new Date();
    firstDate.setDate(today.getDate() - dayRange);
    var firstDateString = timeFormatNew(firstDate);
    var todayString = timeFormatNew(today);

    var url = "http://35.180.229.230:6789/temperatures/select/v2.0?start=" + firstDateString + "&end=" + todayString;

    axios
      .get(url)
      .then((res) => {
        const { newTemperatures, max, min, last } = handleData(res.data);
        setData(res.data);
        setTemperatures(newTemperatures);
        setXMax(max);
        setXMin(min);
        setLastId(last);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        setError(true);
      });
  };


  const renderAxisBottom = (data) => {
    const axisBottom = [];
    const daysData = data[0].data;
    // only keep 31 ticks in the bottom axis
    daysData.forEach((val, index) => {
      if (index % Math.ceil(daysData.length / 32) === 0) axisBottom.push(val.x);
    });
    return axisBottom;
  };
  // {data.length > 0 && <LastTemperatures lastTemp={data.find((d) => d.id === lastId)} />}

  return (
    <Page>
      <GlobalStyle />
      <Container>
        <AppBar color="primary" position="relative">
          <Title>Cluny Street Brewery</Title>
        </AppBar>
        {data.length > 0 && <LastTemperatures lastTemp={data.find((d) => d.id === lastId)} />}
        <GraphCard>
          {temperatures.length > 0 && (
            <ResponsiveLine
              curve="natural"
              minY="auto"
              colors={['royalblue', 'forestgreen', 'gold']}
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
                min: xMin - 2,
                max: xMax + 2,
              }}
              xScale={{
				type: 'time',
				format: timeFormatDef,
				precision: 'second',
			  }}
              axisBottom={{
	            format: "%d/%m %H:%m",
	            tickRotation: -45,
	            tickValues: 20,
	          }}
              data={temperatures}
            />
          )}
          {loading && <CircularProgress size={100} />}
          {error && (
            <ErrorContainer>
              <ErrorOutlined style={{ fontSize: '3em' }} />
              <p>An error as occurred</p>
            </ErrorContainer>
          )}
        </GraphCard>
        <ReloadButtonContainer>
          <Fab color="secondary" aria-label="Reload" onClick={loadData}>
            {loading ? <CircularProgress color="primary" size={25} /> : <CachedIcon />}
          </Fab>
        </ReloadButtonContainer>
      </Container>
    </Page>
  );
};

export default App;
