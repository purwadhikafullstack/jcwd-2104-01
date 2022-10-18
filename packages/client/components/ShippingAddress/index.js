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
import RenderAddress from '../RenderAddress';

function ShippingAddress(props) {
  const {
    isOpen,
    onClose,
    userAddresses,
    fetchUserAddresses,
    setSelectedAddress,
    setSelectedShipper,
    setSelectedShippingCost,
  } = props;
  const [modalEdit, setModalEdit] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  // const [currentAddress, setCurrentAddress] = useState();
  // console.log(currentAddress);

  const toast = useToast();

  // useEffect(() => {
  //   setCurrentAddress(userAddresses[0]);
  // }, []);

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
      <RenderAddress
        address={address}
        index={index}
        fetchUserAddresses={fetchUserAddresses}
        onUpdateisMain={onUpdateisMain}
        setSelectedAddress={setSelectedAddress}
        setSelectedShipper={setSelectedShipper}
        setSelectedShippingCost={setSelectedShippingCost}
        onClose={onClose}
      />
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
