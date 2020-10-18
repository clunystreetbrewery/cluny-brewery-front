import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Card from '@material-ui/core/Card';

const LastTemperaturesContainer = styled(Card)`
  margin: 2em 1em 0 1em;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LastTemperatureTitle = styled.p`
  text-align: center;
  font-size: 1.5em;
  margin: 0;

  @media (max-width: 700px) {
    font-size: 1em;
  }
`;

const LastTemperature = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Color = styled.div`
  margin-right: 0.5em;
  height: 1em;
  width: 1em;
  background-color: ${(props) => props.color};
`;

const Temperature = styled.p`
  font-weight: bold;
  margin: 0;
  width: 5em;
  text-align: left;
`;

const LastTemperatures = ({ lastTemp }) => {
  if (!lastTemp) return null;

  const lastTimeFromNow = moment(lastTemp.date).fromNow();
  const lastBlueTemp = lastTemp.temperature_blue.toFixed(2);
  const lastGreenTemp = lastTemp.temperature_green.toFixed(2);
  const lastYellowTemp = lastTemp.temperature_yellow.toFixed(2);

  return (
    <LastTemperaturesContainer>
      <LastTemperatureTitle>Last temperature records from {lastTimeFromNow}</LastTemperatureTitle>
      <LastTemperature>
        Outside fridge :
        <Color style={{ marginLeft: 10 }} color="gold" />
        <Temperature>
          {lastYellowTemp}
          °C
        </Temperature>
      </LastTemperature>
      <LastTemperature>
        <Color color="royalblue" />
        <Temperature>
          {lastBlueTemp}
          °C
        </Temperature>
      </LastTemperature>
      <LastTemperature>
        <Color color="forestgreen" />
        <Temperature>
          {lastGreenTemp}
          °C
        </Temperature>
      </LastTemperature>
    </LastTemperaturesContainer>
  );
};

export default LastTemperatures;
