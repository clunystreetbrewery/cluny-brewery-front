import React, { useState } from 'react';
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
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.p`
  color: tomato;
`;

const LoginForm = ({ closeModal, setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      const res = await axios.post(apiUrl + '/login', { username, password });

      if (res.data.error) {
        throw new Error(res.data.error);
      }

      const token = res.data.token;
      localStorage.setItem('token', token);

      setIsLoggedIn(true);

      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <TextField
        id="username"
        label="Username"
        required
        value={username}
        onChange={onChangeUsername}
      />
      <TextField
        id="password"
        label="Password"
        required
        value={password}
        onChange={onChangePassword}
        type="password"
        style={{ marginTop: '1rem' }}
      />
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '2rem' }}>
        Login
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
    </FormContainer>
  );
};

const Header = ({setIsLoggedIn}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const token = localStorage.getItem('token');



  return (
    <>
      <AppBar color="primary" position="relative">
        <Title>
          Cluny Street Brewery
          {token ? (
            <Chip color="secondary" icon={<ThumbUp />} label="Logged in" />
          ) : (
            <Button variant="contained" color="secondary" onClick={toggleModal}>
              Login
            </Button>
          )}
        </Title>
      </AppBar>
      <Modal open={isModalOpen} onClose={toggleModal} aria-labelledby="login-modal">
        <ModalContainer>
          <CloseContainer>
            <CloseIcon onClick={toggleModal} />
          </CloseContainer>
          <LoginForm closeModal={toggleModal} setIsLoggedIn={setIsLoggedIn}/>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default Header;
