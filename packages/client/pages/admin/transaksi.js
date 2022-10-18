import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  Flex,
  Spacer,
  Box,
  Select,
} from '@chakra-ui/react';
import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AdminHistory from '../../components/HistoryTransaction/AdminHistory';
import AdminProofPayment from '../../components/HistoryTransaction/AdminProofPayment';
import AdminSendOrder from '../../components/HistoryTransaction/AdminSendOrder';

import axiosInstance from '../../src/config/api';
import styles from './Product.module.css';
import ReactPaginate from 'react-paginate';

export default function Transaksi(props) {
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState('transactionId');
  const [order, setOrder] = useState('ASC');

  const handlePageClick = (e) => {
    setPage(e.selected);
  };
  const onClickOrder = (e) => {
    let splitting = e.target.value.split(' ');

    setSorting(splitting[0]);
    setOrder(splitting[1]);
  };
  useEffect(() => {
    fetchTransaction();
  }, [selected, page, sorting, order]);

  const fetchTransaction = async () => {
    try {
      const res = await axiosInstance.get(
        `/transactions/allTransByAdmin?selected=${selected}&page=${
          page + 1
        }&sorting=${sorting}&order=${order}`,
      );

      setData(res.data.data.restransactionStatus);
    } catch (error) {
      console.log(error);
    }
  };

  function selectedStatus() {
    return data?.map((x, i) => {
      return <AdminHistory data={x} selected={selected} key={i} />;
    });
  }

  function confirmPayment() {
    return data?.map((x, i) => {
      return (
        <AdminProofPayment
          data={x}
          selected={selected}
          key={i}
          fetchTransaction={fetchTransaction}
        />
      );
    });
  }
  function sendItem() {
    return data?.map((x, i) => {
      return (
        <AdminSendOrder
          data={x}
          selected={selected}
          key={i}
          fetchTransaction={fetchTransaction}
        />
      );
    });
  }

  return (
    <Flex justifyContent="center">
      <AdminSidebar />
      <Flex width="85%" direction="column">
        <Text fontSize={30} fontWeight={'semibold'} my={1} marginStart="10">
          Riwayat Pemesanan
        </Text>
        <Box h="87%" w="90%" bg="#F5F6F6" mx="auto">
          <Select
            value={sorting}
            placeholder="Urutkan"
            onChange={onClickOrder}
            w="fit-content"
          >
            <option value="transactionId ASC">Transaction Id ASC</option>
            <option value="transactionId DESC">Transaction Id DESC</option>
            <option value="createdAt ASC">Date ASC</option>
            <option value="createdAt DESC">Date DESC</option>
          </Select>
          <Flex direction="column" w="100%" h="100%">
            <Flex justifyContent={'center'}>
              <Tabs onChange={(i) => setSelected(i)} mx={120}>
                <TabList justifyContent={'center'}>
                  <Tab>Semua</Tab>
                  <Tab>Menuggu Pembayaran</Tab>
                  <Tab>Menuggu Konfimasi Pembayaran</Tab>
                  <Tab>Diproses</Tab>
                  <Tab>DiBatalkan</Tab>
                  <Tab>Dikirim</Tab>
                  <Tab>Pesanan Dikonfirmasi</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div>{selectedStatus()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{selectedStatus()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{confirmPayment()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{sendItem()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{selectedStatus()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{selectedStatus()}</div>
                  </TabPanel>
                  <TabPanel>
                    <div>{selectedStatus()}</div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
            <Flex justifyContent={'center'}>
              <ReactPaginate
                forcePage={page}
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={Math.ceil(props.totalPage / 5)}
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
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/' } };

    const userId = session.user.userId;
    const accessToken = session.user.accessToken;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);

    if (!resGetUser.data.data.isAdmin)
      return { redirect: { destination: '/' } };
    const restransactionUser = await axiosInstance.get(
      `/transactions/allTransByAdmin`,
      { params: context.query },
    );

    return {
      props: {
        user: resGetUser.data,
        transaction: restransactionUser.data.data.restransactionStatus,
        totalPage: restransactionUser.data.data.totalPage,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
