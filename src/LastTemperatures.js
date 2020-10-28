import React from 'react';
import styled from 'styled-components';

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

const fromNow = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor(seconds / 2592000);
  const days = Math.floor(seconds / 86400);

  if (days > 548) {
    return years + ' years ago';
  }
  if (days >= 320 && days <= 547) {
    return 'a year ago';
  }
  if (days >= 45 && days <= 319) {
    return months + ' months ago';
  }
  if (days >= 26 && days <= 45) {
    return 'a month ago';
  }

  const hours = Math.floor(seconds / 3600);

  if (hours >= 36 && days <= 25) {
    return days + ' days ago';
  }
  if (hours >= 22 && hours <= 35) {
    return 'a day ago';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes >= 90 && hours <= 21) {
    return hours + ' hours ago';
  }
  if (minutes >= 45 && minutes <= 89) {
    return 'an hour ago';
  }
  if (seconds >= 90 && minutes <= 44) {
    return minutes + ' minutes ago';
  }
  if (seconds >= 45 && seconds <= 89) {
    return 'a minute ago';
  }
  if (seconds >= 0 && seconds <= 45) {
    return 'a few seconds ago';
  }
};

const COLOR_MAPPING = {
  Blue: 'royalblue',
  Green: 'forestgreen',
  Yellow: 'gold',
};

const LastTemperatures = ({ temperatures }) => {
  const lastTempIndex = temperatures[0].data.length - 1;
  const lastTimeFromNow = fromNow(new Date(temperatures[0].data[lastTempIndex].x));

  return (
    <LastTemperaturesContainer>
      <LastTemperatureTitle>Last temperature records from {lastTimeFromNow}</LastTemperatureTitle>
      {temperatures.map(({ id, data }) => (
        <LastTemperature key={id}>
          {COLOR_MAPPING[id] === 'gold' && (
            <span style={{ marginRight: 10 }}>Outside fridge :</span>
          )}
          <Color color={COLOR_MAPPING[id]} />
          <Temperature>
            {data[lastTempIndex].y}
            °C
          </Temperature>
        </LastTemperature>
      ))}
    </LastTemperaturesContainer>
  );
};

export default LastTemperatures;
