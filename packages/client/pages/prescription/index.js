import { useState } from 'react';
import axiosInstance from '../../src/config/api';
import '@fontsource/poppins';
import Navbar from '../../components/Navbar';
import {
  Box,
  ChakraProvider,
  Flex,
  HStack,
  Text,
  useToast,
  Link,
  Button,
  VStack,
  FormLabel,
  FormControl,
  Spacer,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import theme from '../../components/theme';
import PrescriptInfo from '../../components/PrescriptInfo';
import { useSession, getSession } from 'next-auth/react';
import ShippingCard from '../../components/ShippingCard';

import { useRouter } from 'next/router';

function Prescription(props) {
  const router = useRouter();
  const [prescriptionSource, setPrescriptionSource] = useState();
  const [prescriptionImage, setPrescriptionImage] = useState();
  const [selectedAddress, setSelectedAddress] = useState(props.addresses[0]);
  const [selectedShipper, setSelectedShipper] = useState();
  const [selectedShippingCost, setSelectedShippingCost] = useState();

  const toast = useToast();
  const { data: session } = useSession();

  const onUploadPrescription = async () => {
    try {
      const session = await getSession();

      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const gambar = prescriptionImage;
      const data = new FormData();
      const fileName = Date.now() + gambar.name;
      data.append('name', fileName);
      data.append('gambar', gambar);

      const name = `/public/prescription/${fileName}`;

      await axiosInstance.post('/prescriptions/upload', data, config);

      const resPostPrescription = await axiosInstance.post(
        '/prescriptions/',
        { name },
        config,
      );

      try {
        const splitKurir = selectedShippingCost.split(',');
        const kurir = `${selectedShipper},${splitKurir[0]}`;
        const biaya = splitKurir[1];
        const estimasi = splitKurir[2];
        const body = {
          addressId: selectedAddress.addressId,
          kurir,
          biaya,
          estimasi,
        };

        await axiosInstance.post('/transactions/newPrescription', body, config);
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }

      toast({
        description: resPostPrescription.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const cancelImage = () => {
    setPrescriptionSource();
    setPrescriptionImage();
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar session={session} user={props.user} />
      <Box mx={{ base: '24px', md: '120px' }} mt="24px" pb="2%">
        <HStack>
          <NextLink href="/">
            <Link
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Text
                width={'71px'}
                fontWeight="500"
                letterSpacing={'0.15px'}
                color={'#B7B7B7'}
                mr="14px"
              >
                Beranda
              </Text>
            </Link>
          </NextLink>
          <Image
            width={'4.67px'}
            height="9.33px"
            src="/arrow.svg"
            alt="arrow icon"
          />
          <Text fontWeight="500" letterSpacing={'0.15px'} color={'#008DEB'}>
            Unggah Resep
          </Text>
        </HStack>
        <Box width="240px" mt="32px" height="28px">
          <Text fontWeight="500" fontSize="22px" lineHeight="28px">
            Unggah Resep Dokter
          </Text>
        </Box>
        <Box bg="#FCE19C" height="48px" mt="16px">
          <Flex ps={'26px'} py="12px" direction="row">
            <Image
              width="20px"
              height="20px"
              src="/icon.svg"
              alt="warning icon"
            />
            <HStack ml="18px">
              <Text fontWeight="400" fontSize="14px" letterSpacing="0.15px">
                Verifikasi resep dilakukan
              </Text>
              <Text fontWeight="600" fontSize="16px" letterSpacing="0.15px">
                setiap hari pada pukul 09.00 - 20.00,
              </Text>
              <Text fontWeight="400" fontSize="14px" letterSpacing="0.15px">
                jika terlewat akan dilakukan di keesokan harinya
              </Text>
            </HStack>
          </Flex>
        </Box>
        {prescriptionSource && (
          <ShippingCard
            selectedAddress={selectedAddress}
            selectedShipper={selectedShipper}
            selectedShippingCost={selectedShippingCost}
            setSelectedAddress={setSelectedAddress}
            setSelectedShipper={setSelectedShipper}
            setSelectedShippingCost={setSelectedShippingCost}
            addresses={props.addresses}
            user={props.user}
          />
        )}
        <Box
          align="center"
          width="794px"
          height="352px"
          mx="157px"
          mt="30px"
          bg="#F5F6F6"
          borderRadius="10px"
        >
          <VStack>
            {!prescriptionSource ? (
              <>
                <FormControl>
                  <FormLabel
                    mt="124px"
                    pt="2"
                    bg="blue.100"
                    width="165px"
                    height="40px"
                    borderRadius="100px"
                    htmlFor="image"
                    cursor={'pointer'}
                    color="twitter.500"
                    textAlign={'center'}
                  >
                    + Upload Resep
                  </FormLabel>
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    id="image"
                    name="prescriptionImage"
                    accept=".png, .jpg, .gif"
                    onChange={(e) => {
                      setPrescriptionImage(e.target.files[0]);
                      setPrescriptionSource(
                        URL.createObjectURL(event.target.files[0]),
                      );
                    }}
                  />
                </FormControl>
                <Text
                  pt="25px"
                  fontFamily="Poppins"
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="12px"
                >
                  Format gambar: .JPG, .PNG, max 2 Mb
                </Text>
              </>
            ) : (
              <>
                <HStack ml="5.5%" align="start">
                  <Box width="350px" height="250" mt="20px">
                    <Image
                      width="350px"
                      height="250"
                      src={prescriptionSource}
                      alt="gambar resep"
                    />
                  </Box>
                  <Button variant="ghost" onClick={cancelImage}>
                    X
                  </Button>
                </HStack>
                {prescriptionImage?.size >= 2017920 ? (
                  <Flex direction={'column'}>
                    <Text fontSize={'xs'} color="red">
                      Maksimal Ukuran Gambar adalah 2 Mb
                    </Text>
                    <Button onClick={cancelImage} mx="auto" textColor={'red'}>
                      cancel
                    </Button>
                  </Flex>
                ) : (
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
                          setPrescriptionImage(e.target.files[0]);
                          setPrescriptionSource(
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
                      onClick={() => {
                        onUploadPrescription();
                        setPrescriptionSource();
                        setPrescriptionImage();
                      }}
                    >
                      Masuk Keranjang
                    </Button>
                  </HStack>
                )}
              </>
            )}
          </VStack>
        </Box>

        <PrescriptInfo />
      </Box>
    </ChakraProvider>
  );
}

export default Prescription;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) return { redirect: { destination: '/' } };
    const userId = session.user.userId;
    const accessToken = session.user.accessToken;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);
    if (!resGetUser.data.data.isVerified)
      return { redirect: { destination: '/' } };

    const getUserAddresses = await axiosInstance.get(
      `/addresses/userAddress`,
      config,
    );
    return {
      props: {
        user: resGetUser.data.data,
        addresses: getUserAddresses.data.data,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
