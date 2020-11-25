import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';

import { apiUrl } from './App';


const ModalContainer = styled(Card)`
  margin: 1em 1em 1em 1em;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TargetTemperatureTitle = styled.p`
  text-align: center;
  font-size: 1.5em;
  margin: 0;

  @media (max-width: 700px) {
    font-size: 1em;
  }
`;


const FormContainer = styled.form`
  width: 100%;
  padding: 1em;
  justify-content: space-between;
  margin: auto;
`;


const ErrorText = styled.p`
  color: tomato;
`;


const TemperaturePickerWidget = ({raspberryStatus, targetTemperature, setTargetTemperature}) => {


  const [inputTargetTemperature, setInputTargetTemperature] = useState(targetTemperature);
  const [isIncubatorRunningSwitch, setIsIncubatorRunningSwitch] = useState(raspberryStatus["is_incubator_running"]);
  const [isIncubatorRunning, setIsIncubatorRunning] = useState(raspberryStatus["is_incubator_running"]);

  const [error, setError] = useState(false);
  const token = localStorage.getItem('token');


  useEffect(() => {
    if(raspberryStatus["is_incubator_running"]){
      setIsIncubatorRunningSwitch(true)
    }
  }, [raspberryStatus]);



  const handleSwitchChange = (event) => {
    setIsIncubatorRunningSwitch(event.target.checked);
    let config = {
     headers: { Authorization: `Bearer ${token}`}
   };


    axios.get(apiUrl + '/incubator' + '?switch=' + event.target.checked, config)
        .then((res) => {
          setIsIncubatorRunning(res.data.is_incubator_running);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  };




  const onChangeTargetTemperature = (e) => {
    setInputTargetTemperature(e.target.value);
  }

  const onSubmit = async (e) => {

    let config = {
     headers: { Authorization: `Bearer ${token}`}
    };

    let data = {value: inputTargetTemperature};

    e.preventDefault();
    try {
      setError(false);
      const res = await axios.post(apiUrl + '/set_fridge_temperature', data, config);
      setTargetTemperature(res.data.new_target_temperature);
      let raspberryStatusNew = raspberryStatus;
      axios.get(apiUrl + '/incubator', config)
          .then((res) => {
            setIsIncubatorRunning(res.data.is_incubator_running);
        })
        .catch((e) => {
          console.error(e);
          setError(true);
        });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <ModalContainer>
    <p> Incubator: {isIncubatorRunning ? <span style={{color:"green"}}> Running </span> : <span style={{color:"red"}}> Not running </span>} </p>
    <Switch
        checked={isIncubatorRunningSwitch}
        onChange={handleSwitchChange}
        color="primary"
        name="checkedB"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />

    <p>Target temperature: {targetTemperature}°C</p>
    <FormContainer onSubmit={onSubmit}>
     <input type="number" onChange={onChangeTargetTemperature} value={inputTargetTemperature} min="4" max="30"/>
     <Button type="submit" variant="contained" color="primary">
        Enter new target
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
     </FormContainer>
     </ModalContainer>
  );
};

export default TemperaturePickerWidget;
