import {
  Table,
  TableContainer,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

const ProductTable = ({ columns, data, isLoading, key }) => {
  const columnData = useMemo(() => columns, [columns]);
  const rowData = useMemo(() => data, [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columnData,
        data: rowData,
      },
      usePagination,
    );
  return (
    <>
      <TableContainer border="2px" borderRadius="2xl">
        <Table
          size="sm"
          bgColor="blackAlpha.100"
          variant="striped"
          colorScheme="blue"
          color="black"
          fontWeight="medium"
          {...getTableProps()}
        >
          <Thead>
            {headerGroups.map((headerGroup, i) => (
              <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <Th
                    key={i}
                    py="4"
                    fontSize="small"
                    textAlign="center"
                    {...column.getHeaderProps()}
                    isNumeric={column.isNumeric}
                  >
                    {column.render('Header')}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <Tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td
                        key={i}
                        py="4"
                        fontWeight="medium"
                        fontSize="13px"
                        textAlign="center"
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
export default ProductTable;
