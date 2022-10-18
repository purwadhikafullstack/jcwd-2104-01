import {
  Stack,
  Text,
  Flex,
  HStack,
  Spinner,
  Box,
  VStack,
  Center,
  Select,
  Input,
  Button,
} from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axiosInstance from '../../src/config/api';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ProfitCart from '../../components/ReportChart/ProfitChart';
import SalesItemChart from '../../components/ReportChart/SalesItemChart';
import ProductTable from '../../components/ReportProductTable/ProductTable';
import { useRouter } from 'next/router';
import styles from './Product.module.css';
import ReactPaginate from 'react-paginate';
import { calcLength, createDomMotionComponent } from 'framer-motion';

export default function Laporan(props) {
  const [salesItem, setSalesItem] = useState([]);
  const [sortItem, setSortItem] = useState('');
  const [categoryItem, setCategoryItem] = useState([]);
  const [ItemSalesCate, setItemSalesCate] = useState([]);
  const [profitData, setProfitData] = useState({});
  const [profit, setProfit] = useState([]);
  const [categoryProfit, setCategoryProfit] = useState([]);
  const [sortProfit, setSortProfit] = useState('');
  const [transProduct, setTransProduct] = useState([]);
  const [transProduct1, setTransProduct1] = useState([]);
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState('createdAt');
  const [order, setOrder] = useState('ASC');
  const [formState, setFormState] = useState();
  const [totalPage, setTotalPage] = useState(props.totalPage);
  const [totalPage1, setTotalPage1] = useState(props.totalPage1);

  useEffect(() => {
    fetchSalesItem();
  }, [sortItem]);

  const fetchSalesItem = async () => {
    try {
      const body = { timeReport: sortItem };

      const respons = await axiosInstance.post(`/report/salesReportUser`, body);

      setSalesItem(respons.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const convertItemDataByMonth = () => {
    const { countOrder } = salesItem;

    const dataArr = new Array(parseInt(moment().format('MM'))).fill(0);
    let ProductN;
    countOrder?.forEach((val) => {
      ProductN = val.productId;
      dataArr[val.productId] = val.count;
    });
    const data = [
      {
        name: 'Item Sales',
        data: dataArr,
      },
    ];

    setCategoryItem(productID);
    setItemSalesCate(data);
  };
  const productID = [
    'Product 0',
    'Product 1',
    'Product 2',
    'Product 3',
    'Product 4',
    'Product 5',
  ];
  useEffect(() => {
    if (Object.keys(salesItem).length) {
      convertItemDataByMonth();
    }
  }, [salesItem]);

  const saleItemSeries = ItemSalesCate;
  const handleChangeItemSales = (event) => {
    setSortItem(event.target.value);
  };
  const salesItemOption = {
    xaxis: {
      categories: categoryItem,
      labels: {
        show: false,
      },
    },
  };

  //Product transaction Table
  const onHandleChange = (event) => {
    setFormState(event.target.value);
  };
  const onClickOrder = (e) => {
    let splitting = e.target.value.split(' ');

    setSorting(splitting[0]);
    setOrder(splitting[1]);
  };
  const fetchProductTransaction = async () => {
    try {
      const respons = await axiosInstance.get(
        `/report/productTransaction?page=${
          page + 1
        }&sorting=${sorting}&order=${order}&createdAt=${formState}`,
      );

      setTransProduct(respons.data.data.getTransactProduct);
      setTotalPage(respons.data.data.totalPage);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProductTransactiondefault = async () => {
    try {
      const respons = await axiosInstance.get(
        `/report/productTransaction1?page=${
          page + 1
        }&sorting=${sorting}&order=${order}`,
      );
      setTransProduct1(respons.data.data.getTransactProduct);
      setTotalPage1(respons.data.data.totalPage1);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (e) => {
    setPage(e.selected);
  };
  useEffect(() => {
    fetchProductTransaction();
  }, [page, sorting, order, formState]);

  useEffect(() => {
    fetchProductTransactiondefault();
  }, [page, sorting, order, formState]);

  const data1 = React.useMemo(() => [...transProduct], [transProduct]);
  const data = React.useMemo(() => [...transProduct1], [transProduct1]);

  const coloumFunction = () => [
    {
      Header: 'Tanggal',
      accessor: 'createdAt',
      Cell: (props) => moment(props.value).add(1, 'days').format('LLL'),
    },
    {
      Header: 'Nama Obat',
      accessor: 'product.productName',
    },
    {
      Header: 'Unit',
      accessor: 'product.unit',
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },
    {
      Header: 'Harga Satuan',
      accessor: 'product.price',
      Cell: (props) => <div>Rp. {props?.value?.toLocaleString('id')} </div>,
    },
    {
      Header: 'Nilai Jual',
      accessor: 'totalPrice',
      Cell: (props) => <div>Rp. {props?.value?.toLocaleString('id')} </div>,
    },
  ];
  const columns1 = React.useMemo(coloumFunction, []);
  const columns = React.useMemo(coloumFunction, []);

  //PROFIT Chart
  useEffect(() => {
    fetchProfit();
  }, [sortProfit]);
  const Month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const fetchProfit = async () => {
    const body = {
      timeReport: sortProfit,
    };
    try {
      const respons = await axiosInstance.post(`/report/salesTotal`, body);
      setProfitData(respons.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (Object.keys(profitData).length) {
      converProfitDataByMonth();
    }
  }, [profitData]);

  const converProfitDataByMonth = () => {
    const { SaleTotal } = profitData.data;

    const dataArr = new Array(parseInt(moment().format('MM'))).fill(0);
    SaleTotal?.forEach((val) => {
      dataArr[parseInt(moment(val.month).format('MM')) - 1] = val.sum;
    });
    const data = [
      {
        name: 'profit',
        data: dataArr,
      },
    ];

    setCategoryProfit(Month);
    setProfit(data);
  };
  const profitSeries = profit;

  const handleChangeProfit = (event) => {
    setSortProfit(event.target.value);
  };
  const profitOption = {
    xaxis: {
      categories: categoryProfit,
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <Flex justifyContent="center">
      <AdminSidebar />

      <Flex width="85%" direction="column">
        <HStack spacing="50px" ml="48px" mt="22px">
          <ProfitCart
            cardTitle="Profit Penjualan"
            column={6}
            chartOption={profitOption}
            chartSeries={profitSeries}
            selectHandle={handleChangeProfit}
            selectValue={sortProfit}
            chartSort={[
              { sortValue: 'Mingguan', sortTitle: 'Mingguan' },
              { sortValue: 'Bulanan', sortTitle: 'Bulanan' },
              { sortValue: 'Tahunan', sortTitle: 'Tahunan' },
            ]}
            chartType="bar"
            showSelectOption={false}
          />
          <SalesItemChart
            cardTitle="Penjualan Item"
            column={6}
            chartOption={salesItemOption}
            chartSeries={saleItemSeries}
            selectHandle={handleChangeItemSales}
            selectValue={sortItem}
            chartSort={[
              { sortValue: 'Mingguan', sortTitle: 'Mingguan' },
              { sortValue: 'Bulanan', sortTitle: 'Bulanan' },
              { sortValue: 'Tahunan', sortTitle: 'Tahunan' },
            ]}
            chartType="bar"
          />
        </HStack>
        {/* <Box h="87%" w="90%" bg="#F5F6F6"> */}
        <Flex flexDirection="column" mt={410} ml={2} mr={2}>
          <HStack>
            <Select
              value={sorting}
              placeholder="Urutkan"
              onChange={onClickOrder}
              borderColor={'black'}
              w="fit-content"
              my={4}
              ml={1}
            >
              <option value="totalPrice ASC">Nilai Jual ASC</option>
              <option value="totalPrice DESC">Nilai Jual DESC</option>
              <option value="createdAt ASC">Date ASC</option>
              <option value="createdAt DESC">Date DESC</option>
            </Select>

            <Input
              name="createdAt"
              placeholder="Tanggal"
              fontSize={14}
              fontWeight={400}
              type="date"
              onChange={onHandleChange}
              width={200}
              ml={1}
            />
          </HStack>
          {!formState ? (
            <Flex direction={'column'}>
              {' '}
              <ProductTable columns={columns} data={data} />
              <Center mt={(2, 5)}>
                <ReactPaginate
                  marginPagesDisplayed={1}
                  forcePage={page}
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={Math.ceil(totalPage1 / 4)}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                  containerClassName={styles.pagination}
                  pageLinkClassName={styles.pagenum}
                  previousLinkClassName={styles.pagenum}
                  nextLinkClassName={styles.pagenum}
                  activeLinkClassName={styles.active}
                  disabledClassName={styles.disabled}
                />
              </Center>
            </Flex>
          ) : (
            <Flex direction={'column'}>
              <ProductTable columns={columns1} data={data1} />
              <Center mt={(2, 5)}>
                <ReactPaginate
                  forcePage={page}
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={Math.ceil(totalPage / 4)}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                  containerClassName={styles.pagination}
                  pageLinkClassName={styles.pagenum}
                  previousLinkClassName={styles.pagenum}
                  nextLinkClassName={styles.pagenum}
                  activeLinkClassName={styles.active}
                  disabledClassName={styles.disabled}
                />
              </Center>
            </Flex>
          )}
        </Flex>
        {/* </Box> */}
      </Flex>
    </Flex>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) return { redirect: { destination: '/' } };
  try {
    const { userId, accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);
    const restransactionProduct = await axiosInstance.get(
      `/report/productTransaction`,
      {
        params: context.query,
      },
    );
    const restransactionProduct1 = await axiosInstance.get(
      `/report/productTransaction1`,
      {
        params: context.query,
      },
    );

    if (!resGetUser.data.data.isAdmin)
      return { redirect: { destination: '/' } };

    return {
      props: {
        user: resGetUser.data.data,
        transactionProduct: restransactionProduct.data.data.getTransactProduct,
        totalPage: restransactionProduct.data.data.totalPage,
        totalPage1: restransactionProduct1.data.data.totalPage1,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
