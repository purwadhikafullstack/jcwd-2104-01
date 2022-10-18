import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
  useDisclosure,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import { api_origin } from '../../constraint';
import { getSession, useSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';
import Navbar from '../../components/Navbar';
import EditProfile from '../../components/EditProfile';
import AddAddress from '../../components/AddAddress';
import EditAddress from '../../components/EditAddress';

import React, { useEffect, useState } from 'react';
import RenderAddressProfile from '../../components/RenderAddressProfile';
export default function Profile(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(props.user);
  const [userAddresses, setUserAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState();
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const toast = useToast();
  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const getUserAddresses = await axiosInstance.get(
        `/addresses/userAddress`,
        config,
      );
      setUserAddresses(getUserAddresses.data.data);
      setCurrentAddress(getUserAddresses.data.data[0].address);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteAddress = async (addressId) => {
    try {
      setDisabled(true);
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const res = await axiosInstance.delete(
        `/addresses/delete/${addressId}`,
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
      alert(errorMessage);
    } finally {
      setDisabled(false);
    }
  };

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
      alert(errorMessage);
    }
  };

  const renderAddress = () => {
    return userAddresses.map((address, index) => (
      <RenderAddressProfile
        address={address}
        index={index}
        onUpdateisMain={onUpdateisMain}
        onDeleteAddress={onDeleteAddress}
        fetchUserAddresses={fetchUserAddresses}
        disabled={disabled}
        setDisabled={setDisabled}
      />
    ));
  };

  const { data: session } = useSession();

  const onSaveProfile = async (body) => {
    try {
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const updateProfile = {
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        gender: body.gender,
        birthDate: body.birthDate,
      };

      if (body.profileImages) {
        const gambar = body.profileImages;
        const data = new FormData();
        const fileName = Date.now() + gambar.name;
        data.append('name', fileName);
        data.append('gambar', gambar);

        updateProfile.image = `/public/user/${fileName}`;
        try {
          await axiosInstance.post('/users/upload', data, config);
        } catch (error) {
          return toast({
            description: error.response.data.message,
            position: 'top',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }

      try {
        const res = await axiosInstance.patch('/users', updateProfile, config);
        toast({
          description: res.data.message,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        return toast({
          description: error.response.data.message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      const resGetUser = await axiosInstance.get(
        `/users/${user.userId}`,
        config,
      );
      setUser(resGetUser.data.data);
      onClose();
    } catch (error) {
      return toast({
        description: error.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Navbar session={session} user={user} />

      <Box
        marginBlock="10"
        height={'83vh'}
        width={{ base: '90vw', md: '30vw' }}
        mx="auto"
        shadow={{ base: 'unset', md: 'md' }}
      >
        <Box marginInline={'6'}>
          <Text
            mt="9"
            fontSize={{ base: 'md', md: 'md' }}
            fontWeight="medium"
            lineHeight={'6'}
          >
            Profile
          </Text>
          <HStack mt="4" mb="1" pb="2">
            <Image
              objectFit={'cover'}
              rounded={'full'}
              width="80px"
              height="80px"
              alt="gambar profile"
              src={api_origin + user.image}
            />
            <VStack align={'start'} paddingStart="4">
              <Text
                fontSize={{ base: 'md', md: 'md' }}
                fontWeight="medium"
                lineHeight={'6'}
              >
                {`${user.first_name} ${user.last_name}`}
              </Text>
              <Text
                fontSize={{ base: 'md', md: 'md' }}
                fontWeight="medium"
                lineHeight={'6'}
              >
                +62 {user.phone}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box mt="2" mx="6" borderBottom="1px solid #C2CED6">
          <VStack mb="3">
            <Button colorScheme={'twitter'} w="full" onClick={onOpen}>
              Ubah Profil
              <EditProfile
                isOpen={isOpen}
                onClose={onClose}
                userProfile={user}
                onSaveProfile={onSaveProfile}
              />
            </Button>
          </VStack>
        </Box>
        <Box mt="2" mx="6" borderBottom="1px solid #C2CED6">
          <Text
            mt="5"
            mb="2"
            fontSize={{ base: 'md', md: 'md' }}
            fontWeight="medium"
            lineHeight={'6'}
          >
            Alamat
          </Text>
          {userAddresses.length == false ? (
            <Box height="23vh">
              <Text te mx="24%" pt="10%">
                Anda belum memiliki alamat...
              </Text>
            </Box>
          ) : (
            <Box width="full" overflowY="scroll" height="23vh">
              {renderAddress()}
            </Box>
          )}
        </Box>
        <Box mb="4" mt="3.5" mx="6">
          <Button
            colorScheme={'twitter'}
            w="full"
            onClick={() => setModalAdd(true)}
          >
            Tambahkan Alamat
            <AddAddress
              isOpen={modalAdd}
              onClose={() => setModalAdd(false)}
              fetchUserAddresses={fetchUserAddresses}
            />
          </Button>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) return { redirect: { destination: '/' } };

    const { userId, accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);

    const resGetAddress = await axiosInstance.get(
      `/addresses/userAddress`,
      config,
    );

    return {
      props: {
        user: resGetUser.data.data,
        addresses: resGetAddress.data.data,
        session,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
