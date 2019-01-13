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
  background-color: ${props => props.color};
`;

const Temperature = styled.p`
  font-weight: bold;
  margin: 0;
  width: 5em;
  text-align: left;
`;

const Average = styled.p`
  font-weight: bolder;
  margin: 0 0.5em 0 0;
  color: tomato;
`;

class LastTemperatures extends React.PureComponent {
  constructor(props) {
    super(props);
    const lastData = props.data.find(d => d.id === props.lastId);
    this.state = {
      lastTimeFromNow: moment(lastData.date).fromNow(),
      lastAverageTemp: lastData.temperature_average.toFixed(2),
      lastBlueTemp: lastData.temperature_blue.toFixed(2),
      lastYellowTemp: lastData.temperature_yellow.toFixed(2),
      lastGreenTemp: lastData.temperature_green.toFixed(2),
    };
  }

  render = () => (
    <LastTemperaturesContainer>
      <LastTemperatureTitle>
        Last temperature records from {this.state.lastTimeFromNow}
      </LastTemperatureTitle>
      <LastTemperature style={{ marginTop: '1em' }}>
        <Average>Average:</Average>
        <Temperature>
          {this.state.lastAverageTemp}
          °C
        </Temperature>
      </LastTemperature>
      <LastTemperature>
        <Color color="royalblue" />
        <Temperature>
          {this.state.lastBlueTemp}
          °C
        </Temperature>
      </LastTemperature>
      <LastTemperature>
        <Color color="forestgreen" />
        <Temperature>
          {this.state.lastGreenTemp}
          °C
        </Temperature>
      </LastTemperature>
      <LastTemperature>
        <Color color="gold" />
        <Temperature>
          {this.state.lastYellowTemp}
          °C
        </Temperature>
      </LastTemperature>
    </LastTemperaturesContainer>
  );
}

export default LastTemperatures;
