import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import ThumbUp from '@material-ui/icons/ThumbUp';
import CloseIcon from '@material-ui/icons/Close';

import { apiUrl } from './App';

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 1rem;
  }
`;

const ModalContainer = styled(Card)`
  margin: 10rem auto;
  width: 50%;
  height: 50%;
  max-width: 25rem;
  max-height: 35rem;
  outline: 0;
  padding: 2rem;

  @media (max-width: 768px) {
    margin: 0;
    height: 100%;
    width: 100%;
    max-height: none;
    max-width: none;
    box-sizing: border-box;
  }
`;

const CloseContainer = styled.div`
  display: none;
  width: 100%;
  text-align: right;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    display: block;
  }
`;


const FormContainer = styled.form`
  width: 100%;
  display: inline-block;
  border: solid red 1px;
  border-radius: 0.5em;
  padding: 1em;
  justify-content: space-between;
  margin: auto;
`;


const ErrorText = styled.p`
  color: tomato;
`;


const TemperaturePickerWidget = ({target_temperature}) => {


  const [inputTargetTemperature, setInputTargetTemperature] = useState(999);
  const [targetTemperature, setTargetTemperature] = useState(999);

  const [error, setError] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setTargetTemperature(target_temperature);
    setInputTargetTemperature(target_temperature);
  }, [target_temperature] );

  const onChangeTargetTemperature = (e) => {
    setInputTargetTemperature(e.target.value);
  }

  const onSubmit = async (e) => {
   console.log(e);
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
    <FormContainer onSubmit={onSubmit}>
     <span> Target Temperature: {targetTemperature}°C  </span>
     <input name="numberOfGuests" type="number" onChange={onChangeTargetTemperature} defaultValue={target_temperature || ''}/>
     <Button type="submit" variant="contained" color="primary">
        Enter new target
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
     </FormContainer>
     </div>
  );
};

export default TemperaturePickerWidget;
