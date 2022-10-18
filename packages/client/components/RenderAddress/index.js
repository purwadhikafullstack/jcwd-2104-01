import { Box, Button, HStack, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import EditAddress from '../EditAddress';

export default function RenderAddress({
  address,
  index,
  fetchUserAddresses,
  onUpdateisMain,
  setSelectedAddress,
  setSelectedShippingCost,
  setSelectedShipper,
  onClose,
}) {
  const toast = useToast();
  const [modalEdit, setModalEdit] = useState(false);
  return (
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
              }}
            >
              Ubah Alamat
              <EditAddress
                isOpen={modalEdit}
                onClose={() => setModalEdit(false)}
                fetchUserAddresses={fetchUserAddresses}
                addressId={address?.addressId}
                address={address?.address}
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
  );
}
