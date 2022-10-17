import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Text,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import moment from 'moment';
import { TbClock } from 'react-icons/tb';
import { MdArrowDropDown } from 'react-icons/md';
import axiosInstance from '../../src/config/api';
import { api_origin } from '../../constraint';

const AdminTransactionList = ({ data, address, statusTrans }) => {
  return (
    <div key={data.dtId}>
      <Flex>
        <Flex gap="1rem" direction={'column'} maxW="600px">
          {data.map((v, i) => {
            // console.log(v);
            return (
              <div key={i}>
                <Box
                  p="1rem"
                  border="1px"
                  borderColor={'gray.300'}
                  rounded="lg"
                  marginLeft={'2rem'}
                >
                  <Grid templateColumns="repeat(4, 1fr)" gap="1rem">
                    <GridItem colSpan={1}>
                      <Image
                        src={api_origin + v.product.productImage}
                        alt={'user'}
                      />
                    </GridItem>
                    <GridItem colSpan={3}>
                      <Flex direction={'column'} ml="1rem">
                        <Text fontWeight={'700'}>{v.product.productName}</Text>
                        <Text>
                          Rp.{v.product.price.toLocaleString('id-ID')}
                        </Text>
                        <Text>{v.quantity} items</Text>
                        <Text fontWeight={'700'}>
                          Total : Rp.
                          {(v.product.price * v.quantity).toLocaleString(
                            'id-ID',
                          )}
                        </Text>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Box>
              </div>
            );
          })}
        </Flex>
        <Box w="full" px="1rem">
          <Text fontSize={'20px'} fontWeight={'700'} mb="1rem">
            Order Detail
          </Text>
        </Box>
        <Divider orientation="vertical" />
      </Flex>
    </div>
  );
};

export default AdminTransactionList;
