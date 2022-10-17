import {
  Alert,
  Box,
  useToast,
  Button,
  Flex,
  Stack,
  Link,
  Select,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../src/config/api';
import { getSession, useSession } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';
import ListPTransaction from '../../components/CardTransaction/ListPTransaction';
import AdminListPTrans from '../../components/CardTransaction/AdminListPTrans';
import NextLink from 'next/link';

function Transaction(props) {
  const { data: session } = useSession();
  const { getTransactData } = props.transaction.data;

  const toast = useToast();

  const [transactionList, setTransactionList] = useState([]);
  const [transactionListAdmin, setTransactionListAdmin] = useState([]);
  const [statusTrans, setStatusTrans] = useState([]);

  const router = useRouter();

  let status;
  getTransactData.forEach((x, i) => {
    status = x.transaction.transactionStatus;
  });
  const buttDis1 = 'Menunggu Pembayaran';
  const buttDis2 = 'Menunggu Konfirmasi Pembayaran';

  const CancelOrder = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const { transactionId } = router.query;

      const cancel = await axiosInstance.post(
        `/transactions/cancelTransaction/${transactionId}?transactionId=${transactionId}`,
        {},
        config,
      );
      fetchTransactionList();

      if (status == 'Dibatalkan') {
        return toast({
          title: 'Anda perlu memasukan alamat terlebih dahulu',
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confrimOrder = async () => {
    try {
      const { transactionId } = router.query;
      const updateStatus = await axiosInstance.post(
        `/transactions/confirmTransaction/${transactionId}?transactionId=${transactionId}`,
      );

      fetchTransactionList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactionList();
  }, []);
  useEffect(() => {
    fetchTransactionListByAdmin;
  }, []);

  const fetchTransactionList = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const { transactionId } = router.query;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const get = await axiosInstance.get(
        `/transactions/dataTransaction/${transactionId}`,
        config,
      );
      setTransactionList(get.data.data.getTransactData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTransactionListByAdmin = async () => {
    try {
      const { transactionId } = router.query;

      const get = await axiosInstance.get(
        `/transactions/dataTransactionByAdmin?${transactionId}`,
      );

      setTransactionListAdmin(get.data.data.getTransactData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderListTransaction = () => {
    return (
      <ListPTransaction
        data={transactionList}
        statusTrans={statusTrans}
        user={props.user}
      />
    );
  };

  return (
    <Flex>
      {/* admin */}
      {props.user.isAdmin ? (
        <div>
          <Box
            display={['block', 'block', 'block']}
            mb={['100px', '200px', '59px']}
            justifyContent="center"
            mt="66px"
          >
            {renderListTransaction()}

            <Stack
              mt="56px"
              w="826px"
              direction={['column', 'column', 'row']}
              spacing="16px"
            >
              <Link href={`/admin/transaksi`}>
                {' '}
                <Button w="405px" variant="main-outline">
                  Kembali
                </Button>
              </Link>
              {transactionList[0]?.transaction?.transactionStatus ==
                'Menunggu Pembayaran' && (
                <Button
                  size={'xs'}
                  colorScheme={'twitter'}
                  onClick={CancelOrder}
                >
                  Cancel Order
                </Button>
              )}
            </Stack>
          </Box>
        </div>
      ) : (
        // user
        <div>
          {' '}
          <Navbar session={session} user={props.user} />
          <Box
            display={['block', 'block', 'block']}
            // //   mx={[5, 0, 235]}
            // w={['40%', '40%', '40%']}
            mb={['100px', '200px', '59px']}
            justifyContent="center"
            mt="66px"
          >
            {renderListTransaction()}

            <Stack
              mt="56px"
              w="826px"
              direction={['column', 'column', 'row']}
              spacing="16px"
            >
              <Flex
                direction={'row'}
                align="center"
                gap="1rem"
                mt="2rem"
                p={20}
                justifyContent={'center'}
                // width={'100%'}
              >
                {status == 'Dikirim' ? (
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    onClick={confrimOrder}
                  >
                    Delivered Order
                  </Button>
                ) : (
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    onClick={confrimOrder}
                    isDisabled={true}
                  >
                    Delivered Order
                  </Button>
                )}

                {status == buttDis1 ? (
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    onClick={CancelOrder}
                    // isDisabled={status !== buttDis1 }
                  >
                    Cancel Order
                  </Button>
                ) : status == buttDis2 ? (
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    onClick={CancelOrder}
                    // isDisabled={status !== buttDis2}
                  >
                    Cancel Order
                  </Button>
                ) : (
                  <Button
                    size={'xs'}
                    colorScheme={'twitter'}
                    onClick={CancelOrder}
                    isDisabled={true}
                  >
                    Cancel Order
                  </Button>
                )}
              </Flex>
            </Stack>
          </Box>
        </div>
      )}
    </Flex>
  );
}
export default Transaction;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) return { redirect: { destination: '/' } };

    const userId = session.user.userId;
    const accessToken = session.user.accessToken;
    const { transactionId } = context.params;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const resGetUser = await axiosInstance.get(`/users/${userId}`, config);
    const restransactionUser = await axiosInstance.get(
      `/transactions/dataTransaction/${transactionId}`,
      config,
    );

    return {
      props: {
        user: resGetUser.data.data,
        transaction: restransactionUser.data,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { props: { errorMessage } };
  }
}
