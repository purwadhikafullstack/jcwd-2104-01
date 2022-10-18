import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import AdminProduct from '../../../components/AdminProduct';
import AdminSidebar from '../../../components/AdminSidebar';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axiosInstance from '../../../src/config/api';
import ReactPaginate from 'react-paginate';
import styles from './Admin.module.css';
import { useEffect, useState } from 'react';
import AddRacikan from '../../../components/AddRacikan';
import AddProduct from '../../../components/AddProduct';

export default function Inventory(props) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState('');
  const [order, setOrder] = useState('');
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState();

  const {
    isOpen: isRacikOpen,
    onOpen: onRacikOpen,
    onClose: onRacikClose,
  } = useDisclosure();

  useEffect(() => {
    const getProductList = async () => {
      const result = await axiosInstance.get('/product/all');
      setProductList(result.data.result);
    };
    getProductList();
  }, []);

  useEffect(() => {
    setPage(router.query.page - 1);
    setCategories(router.query.category || '');
    setOrder(`${router.query.orderBy} ${router.query.order}` || '');
  }, [router.query.category, router.query.orderBy]);

  const onSelectChange = (e) => {
    if (router.asPath.includes('isRacikan')) {
      router.push(
        `/admin/inventory?page=1&isRacikan=1&category=${e.target.value}`,
      );
    } else {
      router.push(`/admin/inventory?page=1&category=${e.target.value}`);
    }
    setCategories(e.target.value);
  };

  const renderCategory = () => {
    return props.category.map((data) => (
      <option key={data.categoryId} value={data.category}>
        {data.category}
      </option>
    ));
  };

  const renderProduct = () => {
    return props.product.map((products) => {
      return (
        <AdminProduct
          key={products.productId}
          product={products}
          categories={props.category}
        />
      );
    });
  };
  const handlePageClick = (e) => {
    let pages = e.selected + 1;
    setPage(e.selected);
    const path = router.asPath;
    let replaced = path.replace(`page=${router.query.page}`, `page=${pages}`);
    router.push(replaced);
  };

  const onClickOrder = (e) => {
    let splitter = e.target.value.split(' ');
    let paths = router.asPath;
    if (router.query.orderBy) {
      let replaceOrder = paths.replace(
        `orderBy=${router.query.orderBy}&order=${router.query.order}`,
        `orderBy=${splitter[0]}&order=${splitter[1]}`,
      );
      router.push(replaceOrder);
    } else {
      router.push(`${paths}&orderBy=${splitter[0]}&order=${splitter[1]}`);
    }
    setOrder(e.target.value);
  };

  const onSearchHandler = () => {
    const path = router.asPath;
    if (router.query.productName || router.query.productName == 0) {
      let splitter = path.split('&productName');
      let replacer = splitter[0].replace(`page=${router.query.page}`, 'page=1');
      setPage(0);
      router.push(`${replacer}&productName=${search}`);
    } else {
      router.push(`${path}&productName=${search}`);
    }
  };
  return (
    <Flex justifyContent="center">
      <AdminSidebar user={props.user} />
      <Flex width="85%" direction="column">
        <Text
          fontSize={{ base: 'lg', md: '2xl' }}
          fontWeight="semibold"
          marginStart="20"
        >
          Inventory
        </Text>
        <Box h="90%" w="90%" bg="#F5F6F6" mx="auto">
          <Flex direction="column" w="100%" h="100%">
            <Flex
              h="7%"
              w="100%"
              justifyContent="space-between"
              justifyItems="center"
              mb="4"
            >
              <Stack
                minWidth="50%"
                alignItems="center"
                justifyItems="center"
                bg={
                  !router.asPath.includes('isRacikan') ? 'twitter.500' : 'unset'
                }
                justifyContent="center"
                cursor="pointer"
                onClick={() => router.push('/admin/inventory?page=1')}
              >
                <Text
                  fontSize="xl"
                  textAlign="center"
                  color={
                    !router.asPath.includes('isRacikan') ? 'white' : 'unset'
                  }
                >
                  Obat Satuan
                </Text>
              </Stack>
              <Stack
                minWidth="50%"
                alignItems="center"
                justifyItems="center"
                justifyContent="center"
                cursor="pointer"
                bg={
                  router.asPath.includes('isRacikan') ? 'twitter.500' : 'unset'
                }
                onClick={() =>
                  router.push('/admin/inventory?page=1&isRacikan=1')
                }
              >
                <Text
                  fontSize="xl"
                  textAlign="center"
                  color={
                    router.asPath.includes('isRacikan') ? 'white' : 'unset'
                  }
                >
                  Obat Racikan
                </Text>
              </Stack>
            </Flex>
            <Flex direction="column" w="90%" mx="auto">
              <Flex>
                <InputGroup w={'50%'} backgroundColor="white" mb="4">
                  <Input
                    type="text"
                    placeholder="Cari Obat"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      variant={'solid'}
                      bgColor={'transparent'}
                      rounded="none"
                      onClick={onSearchHandler}
                    >
                      <SearchIcon />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Spacer />

                <Select
                  name="category"
                  value={categories}
                  onChange={onSelectChange}
                  w="fit-content"
                >
                  <option value="">Semua Kategori</option>
                  {renderCategory()}
                </Select>

                <Select
                  onChange={onClickOrder}
                  w="fit-content"
                  variant="outline"
                  defaultValue=""
                >
                  <option hidden disabled value="">
                    Urutkan
                  </option>
                  <option value="price ASC">Harga: Rendah ke Tinggi</option>
                  <option value="price DESC">Harga: Tinggi ke Rendah</option>
                  <option value="productName ASC">Nama: A ke Z</option>
                  <option value="productName DESC">Nama: Z ke A</option>
                </Select>
              </Flex>
              {props.totalPage ? (
                <Box h="55vh">{renderProduct()}</Box>
              ) : (
                <Box h="55vh">
                  <VStack marginTop="20">
                    <Image src="/pana.svg" />
                    <Text fontSize="xl">Product tidak ditemukan</Text>
                  </VStack>
                </Box>
              )}
              <Flex justifyContent={'flex-end'}>
                {!router.asPath.includes('isRacikan') ? (
                  <Button colorScheme={'twitter'} onClick={onOpen}>
                    Tambah
                    <AddProduct isOpen={isOpen} onClose={onClose} />
                  </Button>
                ) : (
                  <Button colorScheme={'twitter'} onClick={onRacikOpen}>
                    Racik Obat
                    <AddRacikan
                      isOpen={isRacikOpen}
                      onClose={onRacikClose}
                      category={props.category}
                      productList={productList}
                      getSession={getSession}
                    />
                  </Button>
                )}
              </Flex>
              <ReactPaginate
                forcePage={page}
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={Math.ceil(props.totalPage / 3)}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName={styles.pagination}
                pageLinkClassName={styles.pagenum}
                previousLinkClassName={styles.pagenum}
                nextLinkClassName={styles.pagenum}
                activeLinkClassName={styles.active}
                disabledClassName={styles.disabled}
              />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  try {
    context.query.pageSize = 3;
    const resGetProduct = await axiosInstance.get(`/product`, {
      params: context.query,
    });
    const resGetCategory = await axiosInstance.get('/category');
    const session = await getSession({ req: context.req });
    if (!session) return { redirect: { destination: '/' } };

    const { userId, accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);

    if (!resGetUser.data.data.isAdmin)
      return { redirect: { destination: '/' } };
    return {
      props: {
        product: resGetProduct.data.result,
        totalPage: resGetProduct.data.totalPage,
        category: resGetCategory.data.result,
        user: resGetUser.data.data,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
