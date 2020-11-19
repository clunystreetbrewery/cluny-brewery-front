import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';

import { apiUrl } from './App';


const ModalContainer = styled(Card)`
  margin: 1em 1em 1em 1em;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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


const TemperaturePickerWidget = ({targetTemperature, setTargetTemperature}) => {


  const [inputTargetTemperature, setInputTargetTemperature] = useState(targetTemperature);
  const [error, setError] = useState(false);
  const token = localStorage.getItem('token');


  const onChangeTargetTemperature = (e) => {
    setInputTargetTemperature(e.target.value);
  }

  const onSubmit = async (e) => {
   let config = {};
   config = {
     headers: { Authorization: `Bearer ${token}`}
   };

   let data = {};
   data = {value: inputTargetTemperature};

    e.preventDefault();
    try {
      setError(false);
      const res = await axios.post(apiUrl + '/set_fridge_temperature', data, config);
      setTargetTemperature(res.data.new_target_temperature);

      if (res.data.error) {
        throw new Error(res.data.error);
      }

    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <ModalContainer>
    <p>Target Temperature: {targetTemperature}°C</p>
    <FormContainer onSubmit={onSubmit}>
     <Input type="number" onChange={onChangeTargetTemperature} value={inputTargetTemperature}/>
     <Button type="submit" variant="contained" color="primary">
        Enter new target
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
     </FormContainer>
     </ModalContainer>
  );
};

export default TemperaturePickerWidget;
