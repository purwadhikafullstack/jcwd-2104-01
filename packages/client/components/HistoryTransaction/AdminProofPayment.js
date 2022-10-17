import {
  Button,
  Flex,
  Box,
  HStack,
  Link,
  Image,
  VStack,
} from '@chakra-ui/react';
import { api_origin } from '../../constraint';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../src/config/api';
import { getSession } from 'next-auth/react';

const AdminProofConfirm = ({ data, fetchTransaction }) => {
  const confirmPayment = async () => {
    try {
      const confrimOrder = await axiosInstance.post(
        `/report/confirmTransaction?transactionId=${data.transactionId}`,
      );
      fetchTransaction();
    } catch (error) {
      console.log(error);
    }
  };
  const recejectPayment = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const rejectmOrder = await axiosInstance.post(
        `/report/declineTransaction?transactionId=${data.transactionId}`,
        {},
        config,
      );
      fetchTransaction();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <HStack
        bg={'gray.50'}
        h={100}
        spacing="45"
        my={'8'}
        ml={'10'}
        mr={'20'}
        px={4}
        rounded={6}
        boxShadow="lg"
      >
        <Box w="100px">No.Pembelian: {data.transactionId}</Box>
        <Box w="110px">Status: {data.transactionStatus}</Box>
        <Box w="100px">
          Payment Proof:{' '}
          <Image
            src={api_origin + data.paymentProof}
            h="5vh"
            w={{ base: '50vw', md: '20vw' }}
            alt="Payment User"
          />
        </Box>
        <Box w="100px">
          Total Price: Rp.{' '}
          {data?.total?.toLocaleString('id') || 'Menunggu Proses Admin'}
        </Box>
        <Box w="100px">
          Shiping Price: Rp. {data.biaya.toLocaleString('id')}
        </Box>
        <VStack>
          <Link href={`/transaction/${data.transactionId}`}>
            <Button colorScheme={'twitter'} variant="link">
              Lihat Pesanan
            </Button>
          </Link>
          <Flex
            direction={'row'}
            align="center"
            gap="1rem"
            mt="2rem"
            justifyContent={'center'}
          >
            <Button
              size={'xs'}
              colorScheme={'twitter'}
              onClick={confirmPayment}
            >
              Confirm Payment
            </Button>

            <Button
              size={'xs'}
              colorScheme={'twitter'}
              onClick={recejectPayment}
            >
              Reject Payment
            </Button>
          </Flex>
        </VStack>
      </HStack>
    </div>
  );
};
export default AdminProofConfirm;
