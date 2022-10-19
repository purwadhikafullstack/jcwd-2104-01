import {
  Button,
  Icon,
  Input,
  Flex,
  Box,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Link,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../src/config/api';
import { DeleteIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import axios from 'axios';

const TransactionHistory = ({ data, selected }) => {
  return (
    <div>
      <HStack
        bg={'gray.50'}
        h={100}
        spacing="95"
        my={'10'}
        ml={'20'}
        mr={'20'}
        px={6}
        rounded={6}
        boxShadow="lg"
      >
        <Image
          unoptimized
          alt="Pembelian"
          width={70}
          height={70}
          src={'/login.png'}
        />
        <Box w="180px">No.Pembelian: {data.transactionId}</Box>
        <Box w="180px">Status: {data.transactionStatus}</Box>
        <Box w="180px">
          Total Price: Rp.{' '}
          {data?.total?.toLocaleString('id') || 'Menunggu Proses Admin'}
        </Box>
        <Box w="180px">
          Shiping Price: Rp. {data?.biaya?.toLocaleString('id')}
        </Box>
        {data.transactionStatus == 'Menunggu Konfirmasi Resep' ? null : (
          <div>
            <Link href={`/transaction/${data.transactionId}`}>
              <Button colorScheme={'twitter'} variant="link">
                Lihat Pesanan
              </Button>
            </Link>
          </div>
        )}
      </HStack>
    </div>
  );
};
export default TransactionHistory;
