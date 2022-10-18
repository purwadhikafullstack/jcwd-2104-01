import { Box, Button, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import EditAddress from '../EditAddress';

export default function RenderAddressProfile({
  address,
  index,
  onUpdateisMain,
  onDeleteAddress,
  fetchUserAddresses,
  disabled,
  setDisabled,
}) {
  const [modalEdit, setModalEdit] = useState(false);
  return (
    <Box
      my="1"
      border="2px"
      borderColor="gray.300"
      borderRadius="md"
      width="full"
      key={address.addressId}
    >
      <HStack>
        <Box>
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
            marginStart={2}
            fontSize={{ base: 'md', md: 'md' }}
            fontWeight="normal"
            lineHeight={'6'}
            width="full"
          >
            {address.address}
          </Text>
          <Text
            marginStart={2}
            fontSize={{ base: 'md', md: 'md' }}
            fontWeight="medium"
            lineHeight={'6'}
            width="full"
          >
            {address.city_name}, {address.province}
          </Text>
        </Box>
        <Spacer />
        <VStack>
          {address.isMain == 0 && (
            <Button
              colorScheme={'twitter'}
              mr="4"
              mb="-2"
              variant="ghost"
              size="xs"
              onClick={() => {
                onUpdateisMain(address.addressId);
              }}
            >
              <Text size="xs">Set Utama</Text>
            </Button>
          )}
          <HStack paddingEnd={2}>
            <Button
              variant="ghost"
              size="sm"
              colorScheme={'twitter'}
              onClick={() => {
                // setCurrentAddress(userAddresses[index]);
                setModalEdit(true);
              }}
            >
              Ubah
              <EditAddress
                isOpen={modalEdit}
                onClose={() => setModalEdit(false)}
                fetchUserAddresses={fetchUserAddresses}
                addressId={address.addressId}
                address={address.address}
                province_name={address.province}
                city={address.city_name}
              />
            </Button>
            <Button
              isDisabled={disabled}
              variant="ghost"
              size="sm"
              colorScheme={'twitter'}
              onClick={() => onDeleteAddress(address.addressId)}
            >
              Hapus
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}
