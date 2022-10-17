import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../src/config/api';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { getSession } from 'next-auth/react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

function ForgotPassword(props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const { userId } = props;
  if (!props) {
    return router.replace(`/register`);
  }
  const body = {
    newPassword,
    ConfirmPassword,
  };
  const onClick = async () => {
    try {
      const response = await axiosInstance.patch(
        `/users/forgotPassword/${userId}`,
        body,
      );

      if (response.data.code == 400) {
        setErrorMessage(response.data.message);
      }
      if (!response.error) {
        router.replace('/login');
      }
    } catch (error) {
      console.log(error);
      if (error.response) return alert(error.response.data.message);
      alert(error.message);
    }
  };
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg="gray.700">
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        // bg="white.700"
        bg={'white'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>

        <FormControl id="password" isRequired>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <InputRightElement h={'full'}>
              <Button
                variant={'ghost'}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={ConfirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <InputRightElement h={'full'}>
              <Button
                variant={'ghost'}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Stack spacing={6}>
          <Text color={'red.400'} fontSize={'lg'} fontWeight={'semibold'}>
            {errorMessage}
          </Text>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={onClick}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    if (session) return { redirect: { destination: '/' } };

    const accessToken = context.params.token;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const resGetUser = await axiosInstance.get(
      `/users/forgot/password`,
      config,
    );
    return {
      props: resGetUser.data.user,
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
