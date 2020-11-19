import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';

import { apiUrl } from './App';


const ModalContainer = styled(Card)`
  //margin: 10rem auto;
  width: 100%;
  height: 50%;
  //max-width: 25rem;
  //max-height: 35rem;
  outline: 0;
  padding: 2rem;
  display: inline-block;
  border: solid red 2px;
  border-radius: 0.5em;

  @media (max-width: 768px) {
    margin: 0;
    height: 100%;
    width: 100%;
    max-height: none;
    max-width: none;
    box-sizing: border-box;
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
    <div id="wrapper">
    <ModalContainer>
    <FormContainer onSubmit={onSubmit}>
     <p>Target Temperature: {targetTemperature}°C</p>
     <Input type="number" onChange={onChangeTargetTemperature} value={inputTargetTemperature}/>
     <Button type="submit" variant="contained" color="primary">
        Enter new target
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
     </FormContainer>
     </ModalContainer>
     </div>
  );
};

export default TemperaturePickerWidget;
