import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { apiUrl } from './App';

const Container = styled(Card)`
  position: relative;
  min-width: 10rem;
  margin-top: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
`;

const Incubator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TargetTemperatureTitle = styled.p`
  text-align: center;
  font-size: 1.5rem;

  @media (max-width: 700px) {
    font-size: 1em;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  button {
    margin-top: 0.5rem;
  }
`;

const ErrorText = styled.p`
  color: tomato;
`;

const TemperaturePickerWidget = ({
  targetTemperature,
  setTargetTemperature,
  isIncubatorRunning,
  setIsIncubatorRunning,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputTemp, setInputTemp] = useState(targetTemperature);

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
      
      if(!(res.data.error === undefined)){
        setError(true);
      }    
    } catch (e) {
      console.error(e);
      setError(true);
    }

    setLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrl + '/set_fridge_temperature',
        { value: parseInt(inputTemp) },
        axiosConfig,
      );
      setTargetTemperature(res.data.new_target_temperature);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Container>
      {loading && (
        <LoadingContainer>
          <CircularProgress size="3rem" style={{ marginLeft: 5 }} />
        </LoadingContainer>
      )}
      <Incubator>
        <Switch
          checked={isIncubatorRunning}
          onChange={handleSwitchChange}
          color="primary"
          disabled={loading}
        />
        <p style={{ marginLeft: 15 }}>
          Incubator:
          <span style={{ marginLeft: 5, color: isIncubatorRunning ? 'green' : 'red' }}>
            {isIncubatorRunning ? 'On' : 'Off'}
          </span>
        </p>
      </Incubator>
      <Divider style={{ width: '100%' }} />
      <TargetTemperatureTitle>
        Target temperature: <b>{targetTemperature}°C</b>
      </TargetTemperatureTitle>
      <FormContainer onSubmit={onSubmit}>
        <Input
          value={inputTemp}
          onChange={(e) => setInputTemp(e.target.value)}
          disabled={loading}
          inputProps={{
            type: 'number',
            min: 4,
            max: 29,
          }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Set temperature
        </Button>
      </FormContainer>

      {error && <ErrorText>Oups something went wrong ...</ErrorText>}
    </Container>
  );
};

export default TemperaturePickerWidget;
