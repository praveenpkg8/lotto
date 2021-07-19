import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  container: {
    maxHeight: 640
  }
});

const DataTable = ({
  columns,
  rows,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  pageSizeOptions,
  nextPage,
  pagination
}) => {
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPageNo(0);
  };

  const handleNextPage = () => {
    if (nextPage) {
      setPageNo(pageNo + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNo > 0) {
      setPageNo(pageNo - 1);
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={uuidv4()}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={rows.length}
          rowsPerPage={pageSize}
          page={pageNo}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          nextIconButtonProps={{
            disabled: false,
            onClick: handleNextPage
          }}
          backIconButtonProps={{
            disabled: false,
            onClick: handlePreviousPage
          }}
        />
      )}
    </Paper>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  pageNo: PropTypes.number,
  setPageNo: PropTypes.func,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  pageSizeOptions: PropTypes.array,
  nextPage: PropTypes.bool,
  pagination: PropTypes.bool
};

export default DataTable;
