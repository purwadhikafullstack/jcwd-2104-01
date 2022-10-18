import axiosInstance from '../src/config/api';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMassagee, setErrorMassage] = useState('');

  const onClickEmail = async () => {
    try {
      await axiosInstance.post('users/forgotPassword', { email });
      router.replace('/login');
      alert('succsess send Forgot Password Request');
    } catch (error) {
      console.log(error);
      alert('Email Tidak Terdaftar');
      if (error.response.message == 'Email Tidak Terdaftar') {
        return setErrorMassage('Email Tidak Terdaftar');
      }
    }
  };
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="gray.700">
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={'white'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter Your Registered Email Address
        </Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>

        <Stack spacing={6}>
          <Text color={'red.400'} fontSize={'lg'} fontWeight={'semibold'}>
            {errorMassagee}
          </Text>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={onClickEmail}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword;
