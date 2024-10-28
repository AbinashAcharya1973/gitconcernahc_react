import React, { useState } from 'react'
import { Table, Pagination } from 'react-bootstrap'

const DataTable = ({ data, columns, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const renderTableHeader = () => {
    return (
      <tr>
        {columns.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </tr>
    )
  }

  const renderTableData = () => {
    return currentItems.map((item, index) => (
      <tr key={index}>
        {columns.map((col, idx) => (
          <td key={idx}>{item[col]}</td>
        ))}
      </tr>
    ))
  }

  const renderPagination = () => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i)
    }

    return (
      <Pagination>
        {pageNumbers.map((number) => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  }

  return (
    <div className="table-responsive" style={{ borderRadius: '5px' }}>
      <Table striped bordered hover className="custom-table">
        <thead>{renderTableHeader()}</thead>
        <tbody>{currentItems.length > 0 ? renderTableData() : <tr><td colSpan={columns.length}>No Data Found</td></tr>}</tbody>
      </Table>
      {currentItems[0]?.Total && (
        <div className="d-flex justify-content-center bg-light p-2">
          <span className="badge bg-info">Total Students - {currentItems.reduce((acc, cur) => acc + parseInt(cur.Total), 0)}</span>
        </div>
      )}
      {renderPagination()}
    </div>
  )
}

export default DataTable
