import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { timeFormat } from 'd3-time-format';
import { ResponsiveLine } from '@nivo/line';
import CachedIcon from '@material-ui/icons/Cached';
import ErrorOutlined from '@material-ui/icons/ErrorOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


import Header from './Header';
import GlobalStyle from './GlobalStyle';
import LastTemperatures from './LastTemperatures';
import TemperaturePickerWidget from './TemperaturePickerWidget';



const timeFormatDef = '%Y-%m-%d %H:%M:%S';
const timeFormatNew = timeFormat(timeFormatDef);
export const apiUrl = 'https://api.clunystreetbreweringcompany.com';

const Page = styled.div`
  background-color: whitesmoke;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GraphCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em;
  width: 90vw;
  height: 75vh;
`;

const ReloadButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 3vh;
  color: whitesmoke;
`;

const ErrorContainer = styled.div`
  color: firebrick;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GraphCardContent = ({ temperatures, loading, error, xMin, xMax }) => {
  if (error) {
    return (
      <ErrorContainer>
        <ErrorOutlined style={{ fontSize: '3em' }} />
        <p>An error as occurred</p>
      </ErrorContainer>
    );
  }

  if (loading) {
    return <CircularProgress size={100} />;
  }

  if (temperatures.length > 0) {
    return (
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
          format: '%d/%m %H:%m',
          tickRotation: -45,
          tickValues: 20,
        }}
        curve='monotoneX'
        data={temperatures}
      />
    );
  }

  return null;
};



const useMountEffect = (effectFn) => useEffect(effectFn, []);

const handleData = (data) => {
  let max = 0;
  let min = 100;
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

  // Max number of points
  const maxPointsNumber = 250;
  const intervalBetweenPoints = data.length / maxPointsNumber;
  let counter = 1;

  data.forEach((d) => {
    if (counter < intervalBetweenPoints) {
      counter += 1;
    } else {
      counter = 1;
      min = Math.min(min, d.temperature_blue, d.temperature_green, d.temperature_yellow);
      max = Math.max(max, d.temperature_blue, d.temperature_green, d.temperature_yellow);

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
    }
  });
  newTemperatures.push(temperature_blue, temperature_green, temperature_yellow);

  return { newTemperatures, max, min };
};

const App = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperatures, setTemperatures] = useState([]);
  const [xMax, setXMax] = useState(0);
  const [xMin, setXMin] = useState(100);
  const [dayRange, setDayRange] = useState(7);
  const [targetTemperature, setTargetTemperature] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const loadGlobalState = () => {
    let token = localStorage.getItem('token') || null;

    let config = {
     headers: { Authorization: `Bearer ${token}` },
    };

    axios
     .get(apiUrl + '/check_global_state', config)
     .then((res) => {
       setTargetTemperature(res.data.target_temperature);
       if(res.data.authentification) {
          setIsLoggedIn(true);
       }
       else{
        localStorage.removeItem('token');
       }
     })
     .catch((e) => {
       console.error(e);
       setLoading(false);
       setError(true);
     });
  };


  const loadData = (range) => {
    setLoading(true);
    setError(false);

    let today = new Date(Date.now());
    let firstDate = new Date();

    let url = apiUrl + '/temperatures/select/v2.0';

    if (range > 0) {
      firstDate.setDate(today.getDate() - range);
      let firstDateString = timeFormatNew(firstDate);
      let todayString = timeFormatNew(today);
      url = url + '?start=' + firstDateString + '&end=' + todayString;
    }

    axios
      .get(url)
      .then((res) => {
        const { newTemperatures, max, min } = handleData(res.data);
        setTemperatures(newTemperatures);
        setXMax(max);
        setXMin(min);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        setError(true);
      });
  };

  useMountEffect(() => {
    loadGlobalState();
    loadData(dayRange);
  });

  const handleDayRangeChange = (event) => {
    const range = event.target.value;
    setDayRange(range);
    loadData(range);
  };

  return (
    <Page>
      <GlobalStyle />
      <Container>
        <Header setIsLoggedIn={setIsLoggedIn}/>
        {isLoggedIn && <TemperaturePickerWidget targetTemperature={targetTemperature} setTargetTemperature={setTargetTemperature}/>}
        {temperatures.length > 0 && <LastTemperatures temperatures={temperatures} />}
        <Select style={{ marginTop: '2em'}} value={dayRange} onChange={handleDayRangeChange}>
          <MenuItem value={1}>One day</MenuItem>
          <MenuItem value={7}>One week</MenuItem>
          <MenuItem value={30}>One month</MenuItem>
          <MenuItem value={365}>One year</MenuItem>
          <MenuItem value={0}>All time</MenuItem>
        </Select>
        <GraphCard>
          <GraphCardContent
            error={error}
            loading={loading}
            temperatures={temperatures}
            xMin={xMin}
            xMax={xMax}
          />
        </GraphCard>
        <ReloadButtonContainer>
          <Fab color="secondary" aria-label="Reload" onClick={() => loadData(dayRange)}>
            {loading ? <CircularProgress size={25} /> : <CachedIcon />}
          </Fab>
        </ReloadButtonContainer>
      </Container>
    </Page>
  );
};

export default App;
