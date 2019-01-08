import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Card from '@material-ui/core/Card';

const LastTemperaturesContainer = styled(Card)`
  margin-top: 2em;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LastTemperature = styled.p`
  margin: 0.25em;
`;

const Temperature = styled.span`
  margin-right: 0.5em;
  font-weight: bold;
`;

class LastTemperatures extends React.PureComponent {
  constructor(props) {
    super(props);
    const lastData = props.data.find(d => d.id === props.lastId);
    console.log(lastData.date);
    this.state = {
      lastTimeFromNow: moment(lastData.date).fromNow(),
      lastAverageTemp: lastData.temperature_average.toFixed(2),
    };
  }

  render = () => (
    <LastTemperaturesContainer>
      <LastTemperature>Last average temperature:</LastTemperature>
      <LastTemperature>
        <Temperature>
          {this.state.lastAverageTemp}
          °C
        </Temperature>
        {this.state.lastTimeFromNow}
      </LastTemperature>
    </LastTemperaturesContainer>
  );
}

export default LastTemperatures;
