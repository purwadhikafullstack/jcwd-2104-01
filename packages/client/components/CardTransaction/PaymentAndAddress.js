import {
  Flex,
  Spacer,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import moment from 'moment';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import axiosInstance from '../../src/config/api';
import { useRouter } from 'next/router';
import next from 'next';
import { api_origin } from '../../constraint';

const AddressAndPayment = ({ data, user }) => {
  const [paymentImage, setPaymentImage] = useState();
  const [paymentSource, setPaymentSource] = useState();
  const router = useRouter();

  const toast = useToast();

  let dtId;
  let key;
  let totalPrice;
  let ongkir;
  let status;
  let transactionId;
  let buktibayar;

  data.forEach((v, i) => {
    key = i;
    dtId = v.transaction.transactionId;
    ongkir = v.transaction.biaya;
    totalPrice = v.transaction.total;
    status = v.transaction.transactionStatus;
    transactionId = v.transaction.transactionId;
    buktibayar = v.transaction.paymentProof;
  });
  let NumOnkir = Number(ongkir);
  let NumPrice = Number(totalPrice);
  let grandTotal = NumOnkir + NumPrice;

  const onUploadPayment = async () => {
    try {
      const session = await getSession();

      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const gambar = paymentImage;
      const data1 = new FormData();
      const fileName = Date.now() + gambar.name;
      data1.append('name', fileName);
      data1.append('gambar', gambar);

      const name = `/public/payment/${fileName}`;

      try {
        const res = await axiosInstance.patch(
          `/transactions/upload/payment`,
          data1,
          config,
        );
        router.replace(`/riwayat/`);
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }

      const resUpdatePayment = await axiosInstance.patch(
        `/transactions/${transactionId}`,
        { name },
        config,
      );

      toast({
        description: resUpdatePayment.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setPaymentSource();
      setPaymentImage();
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };
  return (
    <>
      {user.isAdmin ? (
        //admin
        <div>
          <Text fontSize={'15px'} mb="2rem">
            BCA Bank Transfer
          </Text>
          <Flex>
            <Text minW="200px">Bank Account Number </Text>:
            <Spacer />
            <Text textAlign={'end'}> 2104-234-{dtId}</Text>
          </Flex>
          <Flex>
            <Text minW="200px">Price to Pay </Text>:
            <Spacer />
            <Text textAlign={'end'}>
              {' '}
              Rp. {grandTotal.toLocaleString('id-ID')}{' '}
            </Text>
          </Flex>
          <Flex>
            <Text minW="200px" fontWeight={'700'} textColor="red">
              Payment Deadline{' '}
            </Text>
            :
            <Spacer />
            <Text
              textAlign={'end'}
              minW="250px"
              fontWeight={'700'}
              textColor="red"
            >
              {moment(data.createdAt).add(1, 'days').format('LLL')}
            </Text>
          </Flex>
          <VStack mt={20}>
            <Text color={'teal'} _hover={{ color: 'teal.1000' }} cursor="wait">
              Payment Status {status}
            </Text>
          </VStack>
        </div>
      ) : (
        <div>
          <Text fontSize={'15px'} mb="2rem">
            BCA Bank Transfer
          </Text>
          <Flex>
            <Text minW="200px">Bank Account Number </Text>:
            <Spacer />
            <Text textAlign={'end'}> 2104-234-{dtId}</Text>
          </Flex>
          <Flex>
            <Text minW="200px">Price to Pay </Text>:
            <Spacer />
            <Text textAlign={'end'}>
              {' '}
              Rp. {grandTotal.toLocaleString('id-ID')}{' '}
            </Text>
          </Flex>
          <Flex>
            <Text minW="200px" fontWeight={'700'} textColor="red">
              Payment Deadline{' '}
            </Text>
            :
            <Spacer />
            <Text
              textAlign={'end'}
              minW="250px"
              fontWeight={'700'}
              textColor="red"
            >
              {moment(data.createdAt).add(1, 'days').format('LLL')}
            </Text>
          </Flex>
          <Flex direction={'column'} align="center" gap="1rem" mt="2rem">
            {!paymentSource ? (
              <FormControl>
                {status === 'Menunggu Pembayaran' ? (
                  <FormLabel
                    pt="2"
                    ml="115px"
                    bg="#008DEB"
                    width="230px"
                    height="40px"
                    borderRadius="5px"
                    htmlFor="image"
                    cursor={'pointer'}
                    color="white"
                    textAlign={'center'}
                  >
                    Unggah Bukti Pembayaran
                  </FormLabel>
                ) : // <FormLabel
                //   pt="2"
                //   ml="115px"
                //   bg="#008DEB"
                //   width="230px"
                //   height="40px"
                //   borderRadius="5px"
                //   htmlFor="image"
                //   cursor={'pointer'}
                //   color="white"
                //   textAlign={'center'}
                // >
                //   Unggah Bukti Pembayaran
                // </FormLabel>
                null}

                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="image"
                  name="prescriptionImage"
                  accept=".png, .jpg, .gif"
                  onChange={(e) => {
                    setPaymentImage(e.target.files[0]);
                    setPaymentSource(
                      URL.createObjectURL(event.target.files[0]),
                    );
                  }}
                />
              </FormControl>
            ) : (
              <>
                <HStack ml="43px" align="start">
                  <Box pt="20px" width="350px" height="270">
                    <Image
                      width="350px"
                      height="250"
                      src={paymentSource}
                      alt="gambar bukti pembayaran"
                    />
                  </Box>
                  <Button
                    p="-2"
                    variant="ghost"
                    onClick={() => {
                      setPaymentImage();
                      setPaymentSource();
                    }}
                  >
                    X
                  </Button>
                </HStack>
                <HStack align="center" width="350px">
                  <FormControl width="150px">
                    <FormLabel
                      mt="15px"
                      pt="2"
                      bg="#008DEB"
                      width="150px"
                      height="40px"
                      borderRadius="100px"
                      fontSize="15px"
                      htmlFor="image"
                      cursor={'pointer'}
                      color="white"
                      textAlign={'center'}
                    >
                      + Ganti File
                    </FormLabel>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      id="image"
                      name="prescriptionImage"
                      accept=".png, .jpg, .gif"
                      onChange={(e) => {
                        setPaymentImage(e.target.files[0]);
                        setPaymentSource(
                          URL.createObjectURL(event.target.files[0]),
                        );
                      }}
                    />
                  </FormControl>
                  <Spacer />
                  <Button
                    mt="3"
                    color="white"
                    bg="#008DEB"
                    width="150px"
                    height="40px"
                    borderRadius="100px"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="20px"
                    onClick={() => onUploadPayment()}
                  >
                    Unggah
                  </Button>
                </HStack>
              </>
            )}
            {/* <Button colorScheme={'twitter'}>Payment Proof</Button> */}
            <Text color={'teal'} _hover={{ color: 'teal.1000' }} cursor="wait">
              Payment Status {status}
            </Text>
          </Flex>
        </div>
      )}
    </>
  );
};

export default AddressAndPayment;
