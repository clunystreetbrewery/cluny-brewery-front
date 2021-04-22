import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
// import Input from '@material-ui/core/Input';
// import Button from '@material-ui/core/Button';

import { apiUrl } from './App';

const Container = styled(Card)`
  min-width: 10rem;
  margin-top: 2rem;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Incubator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// const TargetTemperatureTitle = styled.p`
//   text-align: center;
//   font-size: 1.5em;
//   margin: 0;

//   @media (max-width: 700px) {
//     font-size: 1em;
//   }
// `;

// const FormContainer = styled.form`
//   width: 100%;
//   padding: 1em;
//   justify-content: space-between;
//   margin: auto;
// `;

// const ErrorText = styled.p`
//   color: tomato;
// `;

const TemperaturePickerWidget = ({
  // targetTemperature,
  // setTargetTemperature,
  isIncubatorRunning,
  setIsIncubatorRunning,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleSwitchChange = async (event) => {
    setError(false);
    setLoading(true);
    try {
      const res = await axios.get(
        apiUrl + '/incubator?switch=' + event.target.checked,
        axiosConfig,
      );
      setIsIncubatorRunning(res.data.is_incubator_running);
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setLoading(false);
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = { value: targetTemperature };

  //   try {
  //     setError(false);
  //     const res = await axios.post(apiUrl + '/set_fridge_temperature', data, axiosConfig);
  //     setTargetTemperature(res.data.new_target_temperature);

  //     axios
  //       .get(apiUrl + '/incubator', axiosConfig)
  //       .then((res) => {
  //         setIsIncubatorRunning(res.data.is_incubator_running);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //         setError(true);
  //       });

  //     if (res.data.error) {
  //       throw new Error(res.data.error);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  if (error) {
    return <Container>Oups something went wrong ...</Container>;
  }

  return (
    <Container>
      <Incubator>
        <Switch
          checked={isIncubatorRunning}
          onChange={handleSwitchChange}
          color="primary"
          disabled={loading}
        />
        <p style={{ marginLeft: 15 }}>
          Incubator:
          {loading ? (
            <CircularProgress size="1rem" style={{ marginLeft: 5 }} />
          ) : (
            <span style={{ marginLeft: 5, color: isIncubatorRunning ? 'green' : 'red' }}>
              {isIncubatorRunning ? 'On' : 'Off'}
            </span>
          )}
        </p>
      </Incubator>

      {/* <p>Target temperature: {targetTemperature}°C</p>
      <FormContainer onSubmit={onSubmit}>
        <input
          type="number"
          onChange={onChangeTargetTemperature}
          value={inputTargetTemperature}
          min="4"
          max="29"
        />
        <Button type="submit" variant="contained" color="primary">
          Enter new target
        </Button>
        {error && <ErrorText>{error}</ErrorText>}
      </FormContainer> */}
    </Container>
  );
};

export default TemperaturePickerWidget;
