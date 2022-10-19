import axiosInstance from '../../src/config/api';
import Navbar from '../../components/Navbar';
import { api_origin } from '../../constraint';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Image,
  Show,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ProductDetail({ product, user }) {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [show, setShow] = useState(false);

  const addToCart = async () => {
    const session = await getSession();
    if (!session)
      return toast({
        title: 'Anda perlu melakukan login terlebih dahulu',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });

    const userId = session.user.userId;
    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const body = {
      quantity: 1,
      productId: product.productId,
    };
    const res = await axiosInstance.post('/carts/add-to-cart', body, config);

    toast({
      description: res.data.message,
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const handleToggle = () => setShow(!show);
  const renderCategory = () => {
    return product.Categories.map((category) => {
      return (
        <Button
          key={category.categoryId}
          width={'max-content'}
          variant="link"
          fontSize={{ base: 'sm', md: 'md' }}
          color="#039177"
          onClick={() =>
            router.push(
              `/product?page=1&category=${category.category}&orderBy=price&order=ASC`,
            )
          }
        >
          {category.category}
        </Button>
      );
    });
  };
  return (
    <>
      <Navbar session={session} user={user} />
      <Show below="md">
        <Box marginBlock={'5'} marginInline="3" onClick={() => router.back()}>
          <ArrowBackIcon fontSize={'4xl'} />
        </Box>
      </Show>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        maxWidth="100vw"
        mx={{ base: 'unseet', md: '20' }}
        marginBlock="5"
        marginInline="5"
      >
        <Flex
          flexGrow={'1'}
          justifyContent={'center'}
          flexShrink="0"
          paddingInline={'20'}
        >
          <Image
            src={api_origin + product.productImage}
            h="40vh"
            w={{ base: '50vw', md: '20vw' }}
            alt="gambar product"
          />
        </Flex>
        <Flex direction={'column'} flexGrow={'2'}>
          <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="medium">
            {product.productName}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="normal"
          >{`Stock ${product.stock}`}</Text>
          <Text
            fontSize="sm"
            fontWeight="normal"
          >{`Per ${product.unit} - ${product.detailProduct.quantity} ${product.satuanUnit}`}</Text>
          <Text fontSize={{ base: 'md', md: 'xl' }}>Kategori : </Text>
          {renderCategory()}
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="medium"
          >{`Rp. ${product.price?.toLocaleString('id')}`}</Text>
          {product.stock != 0 ? (
            <Button
              onClick={addToCart}
              w="max-content"
              variant={'solid'}
              colorScheme="twitter"
              marginBlock={'2'}
            >
              Tambah
            </Button>
          ) : (
            <Button
              w="max-content"
              variant={'solid'}
              isDisabled={true}
              marginBlock={'2'}
            >
              Tambah
            </Button>
          )}
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeigh="medium">
            Deskripsi :{' '}
          </Text>
          <Collapse startingHeight={22} in={show}>
            {product.desc}
          </Collapse>
          {product.desc.length > 40 && (
            <Box
              as="button"
              width={'fit-content'}
              size="sm"
              color={'#008DEB'}
              onClick={handleToggle}
              mt="1rem"
            >
              Show {show ? 'Less' : 'More'}
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const resGetProduct = await axiosInstance.get(
      `/product/${context.params.url}`,
    );

    const session = await getSession({ req: context.req });
    if (session) {
      try {
        const { userId, accessToken } = session.user;
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
        };
        const resGetUser = await axiosInstance.get(`/users/${userId}`, config);

        return {
          props: {
            product: resGetProduct.data.result,
            user: resGetUser.data.data,
          },
        };
      } catch (error) {
        const errorMessage = error.message;
        return { props: { errorMessage } };
      }
    }
    return {
      props: {
        product: resGetProduct.data.result,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
