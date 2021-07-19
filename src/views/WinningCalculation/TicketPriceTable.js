import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

export default function SpanningTable({ value }) {
  const classes = useStyles();

  const tableData = [];
  const tickets = Object.keys(value).slice(0, -2);
  tickets.forEach((element) => {
    const ticket = value[element];
    tableData.push({
      ticketName: element,
      quantity: ticket.quantity,
      sellingPrice: ticket.sellingPrice,
      ticketPurchaseAmount: ticket.purchaseAmount,
      winningAmount: ticket.winningAmount
    });
  });

  const balance =
    Number(value.totalWinningAmount) - Number(value.totalPurchaseAmount) || 0;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2} style={{ color: 'red' }}>
              {value.user}
            </TableCell>
            <TableCell align="center" colSpan={2}>
              Details
            </TableCell>
            <TableCell align="right">Winning</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ticket Name</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Selling Price</TableCell>
            <TableCell align="right">Ticket Purchase Amount</TableCell>
            <TableCell align="right">Winning Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.ticketName}>
              <TableCell>{row.ticketName}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.sellingPrice}</TableCell>
              <TableCell align="right">{row.ticketPurchaseAmount}</TableCell>
              <TableCell align="right">{row.winningAmount}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={2} />
            <TableCell colSpan={3}>Total Winning Amount</TableCell>
            <TableCell align="right">{value.totalWinningAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Total Ticket Purchase Amount</TableCell>
            <TableCell align="right">{value.totalPurchaseAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={2} />
            <TableCell colSpan={3}>Remaining Balance</TableCell>
            <TableCell align="right">{balance}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SpanningTable.propTypes = {
  value: PropTypes.object
};
