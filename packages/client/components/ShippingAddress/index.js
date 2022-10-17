import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  Text,
  ModalBody,
  FormControl,
  HStack,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../src/config/api';
import EditAddress from '../../components/EditAddress';
import AddAddress from '../../components/AddAddress';
import { getSession } from 'next-auth/react';

function ShippingAddress(props) {
  const {
    isOpen,
    onClose,
    setSelectedAddress,
    userAddresses,
    fetchUserAddresses,
    setSelectedShippingCost,
    setSelectedShipper,
  } = props;
  const [modalEdit, setModalEdit] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [currentAddress, setCurrentAddress] = useState();
  // console.log(userAddresses);

  const toast = useToast();

  useEffect(() => {
    setCurrentAddress(userAddresses[0]);
  }, []);

  const onUpdateisMain = async (addressId) => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const res = await axiosInstance.patch(
        `/addresses/isMain/${addressId}`,
        {},
        config,
      );
      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchUserAddresses();
    } catch (error) {
      alert('error cuy');
    }
  };

  const renderAddress = () => {
    return userAddresses.map((address, index) => (
      <Box
        my="2"
        mx="2"
        border="2px"
        borderColor="gray.300"
        borderRadius="md"
        width="97%"
        key={address.addressId}
      >
        <HStack py={1}>
          <Box width="full" align="start">
            {address.isMain == 1 && (
              <Text
                ms="2"
                fontFamily="inherit"
                color="red"
                fontSize={{ base: 'sm', md: 'sm' }}
              >
                Alamat Utama
              </Text>
            )}
            <Text
              marginInline={2}
              fontSize={{ base: 'md', md: 'md' }}
              fontWeight="medium"
              lineHeight={'6'}
            >
              {address.address}
            </Text>
            <Text
              marginInline={2}
              fontSize={{ base: 'md', md: 'md' }}
              fontWeight="medium"
              lineHeight={'6'}
            >
              {address.city_name}, {address.province}
            </Text>
            <HStack>
              <Button
                variant="ghost"
                size="xs"
                colorScheme={'twitter'}
                onClick={() => {
                  setModalEdit(true);
                  setCurrentAddress(userAddresses[index]);
                }}
              >
                Ubah Alamat
                <EditAddress
                  isOpen={modalEdit}
                  onClose={() => setModalEdit(false)}
                  fetchUserAddresses={fetchUserAddresses}
                  addressId={currentAddress?.addressId}
                />
              </Button>
              {address.isMain == 0 && (
                <Button
                  colorScheme={'twitter'}
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    onUpdateisMain(address.addressId);
                  }}
                >
                  <Text size="xs">Jadikan Alamat Utama</Text>
                </Button>
              )}
            </HStack>
          </Box>
          <Box pr={2}>
            <Button
              value={address}
              colorScheme="twitter"
              size="sm"
              onClick={() => {
                setSelectedAddress(address);
                setSelectedShipper();
                setSelectedShippingCost();
                toast({
                  description: 'Berhasil Memilih Alamat Pengiriman',
                  position: 'top',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
                onClose();
              }}
            >
              Pilih Alamat
            </Button>
          </Box>
        </HStack>
      </Box>
    ));
  };
  return (
    <Modal isOpen={isOpen} size={'2xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pilih Alamat Pengiriman</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl px={2} py={3}>
            <Box
              border="1px solid #C2CED6"
              borderRadius="3px"
              overflowY="scroll"
              height="35vh"
              mb={6}
              width="full"
            >
              {renderAddress()}
            </Box>
            <Box align="center">
              <Button
                colorScheme="twitter"
                onClick={() => {
                  setModalAdd(true);
                }}
              >
                Tambah Alamat Pengiriman
                <AddAddress
                  isOpen={modalAdd}
                  onClose={() => setModalAdd(false)}
                  fetchUserAddresses={fetchUserAddresses}
                />
              </Button>
            </Box>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ShippingAddress;
