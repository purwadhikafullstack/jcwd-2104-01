import axiosInstance from '../../../src/config/api';
import AdminSidebar from '../../../components/AdminSidebar';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Text,
  VStack,
  Input,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spacer,
  Button,
  Image,
  useDisclosure,
  Center,
  useToast,
  Link,
} from '@chakra-ui/react';
import AddProductStock from '../../../components/AddProductStock';

export default function DetailStock(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productHistories, setProductHistories] = useState();
  const [productHistoriesNoFilter, setProductHistoriesNoFilter] = useState();
  const [product, setProduct] = useState();
  const [disabled, setDisabled] = useState(false);
  const [sorting, setSorting] = useState('createdAt');
  const [order, setOrder] = useState('ASC');
  const [formStart, setFormStart] = useState();
  const [formEnd, setFormEnd] = useState();

  const toast = useToast();
  const router = useRouter();

  const getDate = new Date();
  const year = getDate.getFullYear();
  const month = getDate.getMonth();
  const date = getDate.getDate();
  const today = `${year}-${month}-${date}`;

  useEffect(() => {
    fetchproductStock();
    fetchproductStockNoFilter();
  }, [sorting, order, formStart, formEnd]);

  useEffect(() => {
    fetchProduct();
    fetchproductStockNoFilter();
  }, []);

  const fetchproductStock = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const resGetStockHistories = await axiosInstance.get(
        `/logHistories/${props.product.productId}?sorting=${sorting}&order=${order}&formStart=${formStart}&formEnd=${formEnd}`,
      );
      setProductHistories(resGetStockHistories.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchproductStockNoFilter = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const resGetStockHistories = await axiosInstance.get(
        `/logHistories/noFilter/${props.product.productId}?sorting=${sorting}&order=${order}`,
      );
      setProductHistoriesNoFilter(resGetStockHistories.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const resGetProduct = await axiosInstance.get(
        `/product/stock/${props.product.productId}`,
      );
      setProduct(resGetProduct.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteStockHistory = async (historyId) => {
    try {
      setDisabled(true);
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = { historyId: historyId, productId: props.product.productId };

      const res = await axiosInstance.delete(
        `/product/stock/${historyId}`,
        body,
      );
      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchproductStock();
      fetchproductStockNoFilter();
      fetchProduct();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setDisabled(false);
    }
  };

  const onClickOrder = (e) => {
    let splitting = e.target.value.split(' ');

    setSorting(splitting[0]);
    setOrder(splitting[1]);
  };

  const onHandleChange = (event) => {
    setFormStart(event.target.value);
  };

  const onHandleChangeEnd = (event) => {
    setFormEnd(event.target.value);
  };

  const renderStockHistory = () => {
    return productHistories?.map((history) => {
      let setTimeOut = new Date(history.createdAt);
      setTimeOut.setDate(setTimeOut.getDate() + 1);
      let today = new Date(history.createdAt);
      let todays = today.getDate();
      let tomorrows = setTimeOut.getDate();
      let sekarang = new Date();
      let sekarangs = sekarang.getDate();

      return (
        <Tr key={history.historyId}>
          <Td pl="3.7%" fontSize={'15px'} borderRight={'1px'}>
            {history.createdAt.slice(0, 10)}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'}>
            {history.product.productName}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="2.6%">
            {history.product.unit}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="4.5%">
            {history.quantity}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'}>
            {history.type}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="3.7%">
            {history.status}
          </Td>
          {tomorrows > sekarangs ? (
            <Td fontSize={'15px'} pl="3.3%">
              {history.product.unit != 'Racikan' ? (
                <Button
                  isDisabled={disabled}
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    onDeleteStockHistory(history.historyId);
                  }}
                >
                  Hapus
                </Button>
              ) : (
                <Button isDisabled={true} size="sm" colorScheme="red">
                  Hapus
                </Button>
              )}
            </Td>
          ) : (
            <Td fontSize={'15px'} pl="3.3%"></Td>
          )}
          {/* <Td fontSize={'15px'} pl="3.3%">
            {history.product.unit != 'Racikan' ? (
              <Button
                isDisabled={disabled}
                size="sm"
                colorScheme="red"
                onClick={() => {
                  onDeleteStockHistory(history.historyId);
                }}
              >
                Hapus
              </Button>
            ) : (
              <Button isDisabled={true} size="sm" colorScheme="red">
                Hapus
              </Button>
            )}
          </Td> */}
        </Tr>
      );
    });
  };

  const renderStockHistoryNoFilter = () => {
    return productHistoriesNoFilter?.map((history) => {
      let setTimeOut = new Date(history.createdAt);
      setTimeOut.setDate(setTimeOut.getDate() + 1);
      let today = new Date(history.createdAt);
      let todays = today.getDate();
      let tomorrows = setTimeOut.getDate();
      let sekarang = new Date();
      let sekarangs = sekarang.getDate();

      return (
        <Tr key={history.historyId}>
          <Td pl="3.7%" fontSize={'15px'} borderRight={'1px'}>
            {history.createdAt.slice(0, 10)}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'}>
            {history.product.productName}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="2.6%">
            {history.product.unit}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="4.5%">
            {history.quantity}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'}>
            {history.type}
          </Td>
          <Td fontSize={'15px'} borderRight={'1px'} pl="3.7%">
            {history.status}
          </Td>
          {tomorrows > sekarangs ? (
            <Td fontSize={'15px'} pl="3.3%">
              {history.product.unit != 'Racikan' ? (
                <Button
                  isDisabled={disabled}
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    onDeleteStockHistory(history.historyId);
                  }}
                >
                  Hapus
                </Button>
              ) : (
                <Button isDisabled={true} size="sm" colorScheme="red">
                  Hapus
                </Button>
              )}
            </Td>
          ) : (
            <Td fontSize={'15px'} pl="3.3%"></Td>
          )}
        </Tr>
      );
    });
  };

  return (
    <Flex>
      {/* <AdminSidebar /> */}
      <Box w="100%">
        <Box
          boxShadow={
            '0px 2px 3px 2px rgba(33, 51, 96, 0.02), 0px 4px 12px 4px rgba(0, 155, 144, 0.08)'
          }
          bg="#FFFFFF"
          h="64px"
          w="100%"
          pt="20px"
        >
          <Box ml="56.75px" h="20px">
            <HStack>
              <NextLink href="/admin/inventory?page=1">
                <Link
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  <Image
                    width={'10px'}
                    height="20px"
                    src="/leftArrow.svg"
                    alt="arrow icon"
                  />
                </Link>
              </NextLink>
              <Text
                fontWeight={700}
                fontSize="20px"
                lineHeight="24px"
                pl="27.75px"
              >
                Detail Stok Obat
              </Text>
            </HStack>
          </Box>
          <Box h="80vh" mt="2%" mx="5%">
            <VStack align="start">
              <Box h="10%" w="100%" borderBottom="1px">
                <HStack p="10px" gap="50px">
                  <FormControl w="17%">
                    <FormLabel>dari:</FormLabel>
                    <Input
                      name="birthDate"
                      value={formStart}
                      onChange={onHandleChange}
                      type="date"
                      max={today}
                    />
                  </FormControl>
                  <FormControl w="17%">
                    <FormLabel>ke:</FormLabel>
                    <Input
                      name="birthDate"
                      value={formEnd}
                      onChange={onHandleChangeEnd}
                      type="date"
                      max={today}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>urutkan</FormLabel>
                    <Select
                      value={sorting}
                      placeholder="Urutkan"
                      onChange={onClickOrder}
                      borderColor={'black'}
                      w="fit-content"
                    >
                      <option value="createdAt ASC">Date ASC</option>
                      <option value="createdAt DESC">Date DESC</option>
                    </Select>
                  </FormControl>
                  <Spacer />
                  <FormControl pt="2.5%" pl="18%">
                    <Button bg="#008DEB" color="white" onClick={onOpen}>
                      Tambah Stok
                    </Button>
                  </FormControl>
                </HStack>
              </Box>
              <Box w="100%">
                <TableContainer
                  justifyContent={'center'}
                  border={'1px'}
                  borderRadius="10px"
                  mx={'3%'}
                  mb="4%"
                >
                  <Center>
                    <Table>
                      <Thead bg="#213360">
                        <Tr justifyContent={'center'}>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Date
                          </Th>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Product
                          </Th>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Unit
                          </Th>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Quantity
                          </Th>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Type
                          </Th>
                          <Th
                            color="white"
                            fontSize={'15px'}
                            borderRight={'1px'}
                          >
                            Status
                          </Th>
                          <Th color="white" fontSize={'15px'}>
                            Action
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {!formStart
                          ? renderStockHistoryNoFilter()
                          : renderStockHistory()}
                      </Tbody>
                    </Table>
                  </Center>
                </TableContainer>
              </Box>
            </VStack>
          </Box>
        </Box>
        <AddProductStock
          isOpen={isOpen}
          onClose={onClose}
          product={product}
          fetchproductStock={fetchproductStock}
          fetchproductStockNoFilter={fetchproductStockNoFilter}
          fetchProduct={fetchProduct}
        />
      </Box>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) return { redirect: { destination: '/' } };

    const resGetStockHistories = await axiosInstance.get(
      `/logHistories/${context.params.productId}`,
    );

    const resGetProduct = await axiosInstance.get(
      `/product/stock/${context.params.productId}`,
    );
    if (session) {
      try {
        const { userId, accessToken } = session.user;
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
        };
        const resGetUser = await axiosInstance.get(`/users/${userId}`, config);
        if (!resGetUser.data.data.isAdmin)
          return { redirect: { destination: '/' } };

        return {
          props: {
            product: resGetProduct.data.data,
            stockHistories: resGetStockHistories.data.data,
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
