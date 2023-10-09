import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

const EditableTable = () => {
  // Initialize the initial state for the table
  const initialTableData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  // Initialize the state for the table name
  const [TableName, setTableName] = useState("Untitled");

  // Initialize the initial column names
  const initialColumnNames = ["Column 1", "Column 2", "Column 3"];

  // Initialize the state for table data and column names
  const [tableData, setTableData] = useState(initialTableData);
  const [columnNames, setColumnNames] = useState(initialColumnNames);

  // Initialize the state for the currently edited cell
  const [editingCell, setEditingCell] = useState({ row: -1, col: -1 });

  // Initialize the state for the current page and define rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Change this to the desired number of rows per page

  // Handle changes in the table name
  const handleTableNameBlur = (event) => {
    const updatedTableName = event.target.value;
    setTableName(updatedTableName);
    console.log(updatedTableName);
  };

  // Function to add a new row
  const addRow = () => {
    const newRow = Array(columnNames.length).fill("");
    setTableData([...tableData, newRow]);

    // Update filteredData
    const newFilteredData = [...filteredData, newRow];
    setFilteredData(newFilteredData);
  };

  // Function to add a new column
  const addColumn = () => {
    const newColumnName = `Column ${columnNames.length + 1}`;
    setColumnNames([...columnNames, newColumnName]);

    // Update tableData for all rows
    const newTableData = tableData.map((row) => [...row, ""]);
    setTableData(newTableData);

    // Update filteredData for all rows
    const newFilteredData = filteredData.map((row) => [...row, ""]);
    setFilteredData(newFilteredData);
  };

  // Function to handle cell value changes
  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex + startIndex) {
        // Adjust rowIndex based on the current page
        const newRow = [...row];
        newRow[colIndex] = value;
        return newRow;
      }
      return row;
    });
    setTableData(updatedData);
  };

  // Function to handle text field focus
  const handleCellFocus = (rowIndex, colIndex) => {
    setEditingCell({ row: rowIndex + startIndex, col: colIndex }); // Adjust rowIndex based on the current page
  };

  // Function to handle text field blur (focus lost)
  const handleCellBlur = () => {
    setEditingCell({ row: -1, col: -1 });
  };

  // Initialize state for deleted rows
  const [deletedRows, setDeletedRows] = useState([]);

  // Initialize state for search-related features
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchedRows, setSearchedRows] = useState([]); // State to store searched rows
  const [searchValue, setSearchValue] = useState("");

  // Function to handle search input changes
  const handleSearchChange = (query) => {
    setSearchValue(query);
    setSearchQuery(query);
    if (!query) {
      setFilteredData([]);
    } else {
      // Filter the tableData based on the search query
      const filtered = tableData.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filtered);
      setSearchedRows(filtered); // Store searched rows
    }
  };

  // Function to delete a row
  const deleteRow = (rowIndex) => {
    // Determine the row to delete based on search results or all data
    const deletedRow = searchQuery
      ? searchedRows[rowIndex]
      : tableData[rowIndex];

    // Find the index of the first occurrence of the deleted row in tableData
    const firstOccurrenceIndex = tableData.findIndex((row) =>
      row.every((cell, colIndex) => cell === deletedRow[colIndex])
    );

    if (firstOccurrenceIndex !== -1) {
      // Remove the first occurrence of the row from the main tableData
      const updatedData = [...tableData];
      updatedData.splice(firstOccurrenceIndex, 1);
      setTableData(updatedData);

      // Update filteredData (if search is active)
      if (searchQuery) {
        const updatedFilteredData = filteredData.filter(
          (_, i) => i !== rowIndex
        );
        setFilteredData(updatedFilteredData);
      }

      // Add the deleted row to the deletedRows array
      setDeletedRows([...deletedRows, deletedRow]);
    }
  };

  // Function to delete a column
  const deleteColumn = (colIndex) => {
    // Update columnNames to remove the deleted column
    const updatedColumnNames = columnNames.filter((_, i) => i !== colIndex);
    setColumnNames(updatedColumnNames);

    // Update tableData to remove the deleted column from each row
    const updatedTableData = tableData.map((row) =>
      row.filter((_, i) => i !== colIndex)
    );
    setTableData(updatedTableData);

    // Update filteredData to remove the deleted column from each row
    const updatedFilteredData = filteredData.map((row) =>
      row.filter((_, i) => i !== colIndex)
    );
    setFilteredData(updatedFilteredData);
  };

  // Calculate the total number of pages based on the number of rows and rows per page
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Reset the editingCell state
    setEditingCell({ row: -1, col: -1 });
  };

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Get the data for the current page
  const currentPageData = searchQuery
    ? filteredData.slice(startIndex, endIndex)
    : tableData.slice(startIndex, endIndex);

  // Determine the data to display based on search
  const displayData = searchQuery ? filteredData : currentPageData;

  // Function to clear the search query
  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setSearchValue(""); // Clear the search input
    setFilteredData([]); // Clear the filtered data
  };

  // Render the table component with appropriate UI elements
  return (
    <div style={{ marginLeft: "50px", maxWidth: "1200px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Input for editing the table name */}
        <input
          type="text"
          defaultValue={TableName}
          onBlur={handleTableNameBlur}
          style={{
            color: TableName === "Untitled" ? "grey" : "black",
            border: "none",
            outline: "none",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        />
        <div>
          {/* Input for searching within the table */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              padding: "8px",
              margin: "16px 0",
              fontSize: "16px",
            }}
          />
          {searchValue && ( // Render clear button when there's input
            <IconButton onClick={handleClearSearch}>
              <ClearIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden", maxWidth: "1200px" }}>
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ alignItems: "center", height: "48px" }}>
              <TableRow>
                {/* Render table column names and delete column buttons */}
                {columnNames.map((columnName, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{
                      backgroundColor: "#c5c5c5",
                      borderBottom: "1px solid grey",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                      }}
                    >
                      {/* Input for editing column names */}
                      <TextField
                        value={columnName}
                        variant="standard"
                        onChange={(e) => {
                          const updatedColumnNames = [...columnNames];
                          updatedColumnNames[colIndex] = e.target.value;
                          setColumnNames(updatedColumnNames);
                        }}
                        style={{ minWidth: "235px", fontWeight: "bold" }}
                      />
                      {/* Button to delete the column */}
                      <IconButton onClick={() => deleteColumn(colIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  id="add-column-button"
                  style={{
                    position: "sticky",
                    right: 0,
                    backgroundColor: "#c5c5c5",
                    borderBottom: "1px solid grey",
                  }}
                >
                  {/* Button to add a new column */}
                  <IconButton onClick={addColumn}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ height: "calc(100% - 48px)" }}>
              {/* Render table rows and cells */}
              {displayData.map((rowData, rowIndex) => (
                <TableRow key={rowIndex}>
                  {rowData.map((cellValue, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{
                        borderBottom: "1px solid #c5c5c5",
                      }}
                    >
                      {/* Input for editing cell values */}
                      <TextField
                        variant="standard"
                        InputProps={{
                          disableUnderline: !(
                            editingCell.row === rowIndex + startIndex &&
                            editingCell.col === colIndex
                          ),
                        }}
                        value={cellValue}
                        onFocus={() => handleCellFocus(rowIndex, colIndex)}
                        onBlur={handleCellBlur}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
                        }
                        placeholder={"Enter data"}
                        style={{ width: "235px" }} // Set a fixed width
                      />
                    </TableCell>
                  ))}
                  <TableCell
                    style={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "#c5c5c5",
                      borderBottom: "1px solid grey",
                      borderLeft: "1px solid grey",
                    }}
                  >
                    {/* Button to delete the row */}
                    <IconButton onClick={() => deleteRow(rowIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          id="add-row-button"
          style={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={addRow}>
            {/* Button to add a new row */}
            <AddIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "16px",
            }}
          >
            {/* Pagination controls */}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default EditableTable;
