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
  Select,
  HStack,
  Input,
  VStack,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import History from '../../components/HistoryTransaction/History';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../src/config/api';
import styles from './Product.module.css';
import ReactPaginate from 'react-paginate';
import { api_origin } from '../../constraint';

function Riwayat(props) {
  const { data: session } = useSession();
  const [user, setUser] = useState(props.user);
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState('transactionId');
  const [order, setOrder] = useState('ASC');

  const [formState, setFormState] = useState();
  const [totalPage, setTotalPage] = useState(props.totalPage1);
  const [totalPage1, setTotalPage1] = useState(props.totalPage);

  const handlePageClick = (e) => {
    setPage(e.selected);
  };

  const onHandleChange = (event) => {
    setFormState(event.target.value);
  };

  const onClickOrder = (e) => {
    let splitting = e.target.value.split(' ');

    setSorting(splitting[0]);
    setOrder(splitting[1]);
  };

  const fetchTransaction = async () => {
    try {
      const session = await getSession();
      const userId = session.user.userId;
      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const res = await axiosInstance.get(
        `/transactions/historyTransaction?selected=${selected}&page=${
          page + 1
        }&sorting=${sorting}&order=${order}&createdAt=${formState}`,
        config,
      );

      setData(res.data.data.restransactionStatus);
      setTotalPage(res.data.data.totalPage);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTransaction1 = async () => {
    try {
      const session = await getSession();
      const userId = session.user.userId;
      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const res = await axiosInstance.get(
        `/transactions/historyTransactionNorm?selected=${selected}&page=${
          page + 1
        }&sorting=${sorting}&order=${order}`,
        config,
      );

      setData1(res.data.data.restransactionStatus);
      setTotalPage1(res.data.data.totalPage1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTransaction1();
  }, [selected, page, sorting, order, formState]);
  useEffect(() => {
    fetchTransaction();
  }, [selected, page, sorting, order, formState]);

  function selectedStatus() {
    return data?.map((x, i) => {
      return <History data={x} selected={selected} key={i} />;
    });
  }
  function selectedStatus1() {
    return data1?.map((y, i) => {
      return <History data={y} selected={selected} key={i} />;
    });
  }

  return (
    <div>
      <div>
        <Navbar session={session} user={props.user} />
      </div>
      <Text fontSize={30} fontWeight={'semibold'} my={8} ml={20}>
        Riwayat Pemesanan
      </Text>
      <Flex>
        <Select
          value={sorting}
          placeholder="Urutkan"
          onChange={onClickOrder}
          w="fit-content"
          my={8}
          ml={20}
        >
          <option value="transactionId ASC">Transaction Id ASC</option>
          <option value="transactionId DESC">Transaction Id DESC</option>
          <option value="createdAt ASC">Date ASC</option>
          <option value="createdAt DESC">Date DESC</option>
        </Select>
        <HStack>
          <Input
            name="createdAt"
            type="Date"
            placeholder="Tanggal"
            fontSize={14}
            fontWeight={400}
            onChange={onHandleChange}
            width={200}
            ml={1}
          />
        </HStack>
      </Flex>

      <Tabs onChange={(i) => setSelected(i)} mx={90}>
        <TabList justifyContent={'center'}>
          <Tab>Semua</Tab>
          <Tab>Menunggu Pembayaran</Tab>
          <Tab>Menunggu Konfimasi Pembayaran</Tab>
          <Tab>Diproses</Tab>
          <Tab>DiBatalkan</Tab>
          <Tab>Dikirim</Tab>
          <Tab>Pesanan Dikonfirmasi</Tab>
        </TabList>
        {!formState ? (
          <>
            {data1.length ? (
              <TabPanels>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{selectedStatus1()}</div>
                </TabPanel>
              </TabPanels>
            ) : (
              <VStack marginTop={105}>
                <Image src="/pana.png" width={250} height={250} />
                <Text paddingTop={6} fontSize={18}>
                  Tidak Ada Transaksi
                </Text>
              </VStack>
            )}
          </>
        ) : (
          <>
            {data.length ? (
              <TabPanels>
                <TabPanel>
                  <div>{selectedStatus()}</div>
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
            ) : (
              <VStack marginTop={105}>
                <Image src="/pana.png" width={250} height={250} />
                <Text paddingTop={6} fontSize={18}>
                  Tidak Ada Transaksi
                </Text>
              </VStack>
            )}
          </>
        )}
      </Tabs>
      {!formState ? (
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
      ) : (
        <ReactPaginate
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
      )}
    </div>
  );
}
export default Riwayat;
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

    const restransactionUser = await axiosInstance.get(
      `/transactions/historyTransactionNorm`,
      config,
      { params: context.query },
    );
    const restransactionUserFitlr = await axiosInstance.get(
      `/transactions/historyTransaction`,
      config,
      { params: context.query },
    );

    return {
      props: {
        user: resGetUser.data.data,
        transaction: restransactionUser.data.data.restransactionStatus,
        totalPages: restransactionUser.data.data.totalPage1,
        totalPages1: restransactionUserFitlr.data.data.totalPage,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
