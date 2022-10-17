import { Button, Flex, Box, HStack, Link, VStack } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../src/config/api';

const SendTransactionAdmin = ({ data, selected, fetchTransaction }) => {
  const sendItem = async () => {
    try {
      const confrimOrder = await axiosInstance.post(
        `/report/sendTransaction?transactionId=${data.transactionId}`,
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
        <Box w="180px">No.Pembelian: {data.transactionId}</Box>
        <Box w="180px">Status: {data.transactionStatus}</Box>
        <Box w="180px">
          Total Price: Rp.{' '}
          {data?.total?.toLocaleString('id') || 'Menunggu Proses Admin'}
        </Box>
        <Box w="180px">
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
            // width={'100%'}
          >
            <Button size={'xs'} colorScheme={'twitter'} onClick={sendItem}>
              Send Item
            </Button>
          </Flex>
        </VStack>
      </HStack>
    </div>
  );
};
export default SendTransactionAdmin;
