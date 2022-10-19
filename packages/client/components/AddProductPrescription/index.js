import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
  Image,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { api_origin } from '../../constraint';
import axiosInstance from '../../src/config/api';
import { getSession } from 'next-auth/react';

export default function AddProductPrescription(props) {
  const {
    isOpen,
    onClose,
    data,
    productList,
    productRacikanList,
    fetchPrescription,
  } = props;
  const toast = useToast();
  const [productName, setProductName] = useState();
  const [quantity, setQuantity] = useState();
  const [products, setProducts] = useState([]);
  const [isDisabled, setIsDisabled] = useState();
  const [isLoading, setIsLoading] = useState();
  const [max, setMax] = useState(0);
  const [url, setUrl] = useState('');
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const cancelDeleteRef = useRef();

  useEffect(() => {
    if (url.length) {
      getProductStock();
    }
  }, [url]);

  useEffect(() => {
    if (!products.length) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [products]);

  const getProductStock = async () => {
    const result = await axiosInstance.get(`/product/${url}`);
    setMax(result.data.result.stock);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = {
        products,
        userId: data.userId,
        prescriptionId: data.prescriptionId,
      };
      const res = await axiosInstance.post(
        '/transactions/inputProductFromPrescription',
        body,
        config,
      );
      toast({
        title: res.data.message,
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      setProducts([]);
      fetchPrescription();
      onClose();
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: error.response.data.message,
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRejectHandler = async (e) => {
    e.preventDefault;
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = { userId: data.userId };
      const res = await axiosInstance.patch(
        '/transactions/reject/prescription',
        body,
        config,
      );
      toast({
        title: res.data.message,
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      setProducts([]);
      fetchPrescription();
      onClose();
    } catch (error) {
      setIsLoading(false);
      return toast({
        title: error.response.data.message,
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteHandler = (productName) => {
    setProducts(products.filter((data) => data.productName != productName));
  };

  const renderProductList = () => {
    return productList?.map((data) => (
      <option key={data.productId} value={`${data.productName} ${data.url}`}>
        {data.productName}
      </option>
    ));
  };

  const renderProductRacikanList = () => {
    return productRacikanList?.map((data) => (
      <option key={data.productId} value={`${data.productName} ${data.url}`}>
        {data.productName}
      </option>
    ));
  };

  const renderProducts = () => {
    return products.map((data) => {
      return (
        <Tr key={data.quantity}>
          <Td>{data.productName}</Td>
          <Td>{data.quantity}</Td>
          <Td>
            <Button
              size="sm"
              colorScheme={'red'}
              onClick={() => onDeleteHandler(data.productName)}
            >
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  const onChangeHandler = (e) => {
    let splitter = e.target.value.split(' ');
    setUrl(splitter.pop());
    setProductName(splitter.join(' '));
  };

  const onTambahHandler = (e) => {
    e.preventDefault();
    let obj = { productName, quantity };
    setProducts([...products, obj]);
    setQuantity('');
    setUrl('');
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buat Racikan</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onTambahHandler} method="post">
          <ModalBody>
            <Flex>
              <Image
                src={api_origin + data.prescriptionImage}
                alt="prescription"
                h="container.sm"
                w="40%"
                mx="4"
              />
              <Flex direction="column">
                <Tabs>
                  <TabList>
                    <Tab>Obat Satuan</Tab>
                    <Tab>Obat Racikan</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Flex>
                        <Select
                          name="category"
                          defaultValue="Pilih Obat Satuan"
                          onChange={onChangeHandler}
                          width={'50%'}
                          required
                        >
                          <option value="Pilih Obat Satuan" hidden disabled>
                            Pilih Obat Satuan
                          </option>
                          {renderProductList()}
                        </Select>
                        <Input
                          required
                          type="number"
                          placeholder="masukkan quantity"
                          name="quantity"
                          marginInline="6"
                          width="50%"
                          min={1}
                          max={max}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                        <Button colorScheme="whatsapp" type="submit">
                          Tambah
                        </Button>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Flex>
                        <Select
                          name="category"
                          defaultValue="Pilih Obat Satuan"
                          onChange={onChangeHandler}
                          width={'50%'}
                          required
                        >
                          <option value="Pilih Obat Satuan" hidden disabled>
                            Pilih Obat Racikan
                          </option>
                          {renderProductRacikanList()}
                        </Select>
                        <Input
                          type="number"
                          placeholder="masukkan quantity"
                          name="quantity"
                          marginInline="6"
                          width="50%"
                          max={max}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                        <Button colorScheme="whatsapp" type="submit">
                          Tambah
                        </Button>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                {products.length != 0 && (
                  <TableContainer>
                    <Table
                      variant="striped"
                      colorScheme="teal"
                      size="sm"
                      width="70%"
                    >
                      <Thead>
                        <Tr>
                          <Th>Product</Th>
                          <Th>Quantity</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{renderProducts()}</Tbody>
                    </Table>
                  </TableContainer>
                )}
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="red"
              onClick={onDeleteOpen}
              mr="4"
            >
              Tolak
            </Button>
            <Button
              isLoading={isLoading}
              isDisabled={isDisabled}
              loadingText="Submitting"
              colorScheme="twitter"
              onClick={onSubmitHandler}
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Tolak Resep
              </AlertDialogHeader>

              <AlertDialogBody>
                Apakah kamu yakin ? Kamu tidak akan bisa membatalkan resep yang
                sudah di tolak
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelDeleteRef} onClick={onDeleteClose}>
                  Batalkan
                </Button>
                <Button colorScheme="red" onClick={onRejectHandler} ml={3}>
                  Tolak Resep
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </ModalContent>
    </Modal>
  );
}
