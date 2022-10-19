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
  Image,
} from '@chakra-ui/react';

import { api_origin } from '../../constraint';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../src/config/api';
import { DeleteIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import axios from 'axios';

const AdminTransHistory = ({ data, selected }) => {
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
export default AdminTransHistory;
