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

const EditableTable = () => {
  const initialTableData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const [TableName, setTableName] = useState("Untitled");

  const initialColumnNames = ["Column 1", "Column 2", "Column 3"];

  const [tableData, setTableData] = useState(initialTableData);
  const [columnNames, setColumnNames] = useState(initialColumnNames);

  const [editingCell, setEditingCell] = useState({ row: -1, col: -1 });

  const handleTableNameBlur = (event) => {
    const updatedTableName = event.target.value;
    setTableName(updatedTableName);
    console.log(updatedTableName);
  };

  // Function to add a new row
  const addRow = () => {
    const newRow = Array(columnNames.length).fill("");
    setTableData([...tableData, newRow]);
  };

  // Function to add a new column
  const addColumn = () => {
    const newColumnName = `Column ${columnNames.length + 1}`;
    setColumnNames([...columnNames, newColumnName]);
    const newTableData = tableData.map((row) => [...row, ""]);
    setTableData(newTableData);
  };

  // Function to handle cell value changes
  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedData = tableData.map((row, i) => {
      if (i === rowIndex) {
        const newRow = [...row];
        newRow[colIndex] = value;
        return newRow;
      }
      return row;
    });
    setTableData(updatedData);
  };

  // Function to delete a row
  const deleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, i) => i !== rowIndex);
    setTableData(updatedData);
  };

  // Function to delete a column
  const deleteColumn = (colIndex) => {
    const updatedData = tableData.map((row) =>
      row.filter((_, i) => i !== colIndex)
    );
    const updatedColumnNames = columnNames.filter((_, i) => i !== colIndex);
    setTableData(updatedData);
    setColumnNames(updatedColumnNames);
  };

  // Function to handle text field focus
  const handleCellFocus = (rowIndex, colIndex) => {
    setEditingCell({ row: rowIndex, col: colIndex });
  };

  // Function to handle text field blur (focus lost)
  const handleCellBlur = () => {
    setEditingCell({ row: -1, col: -1 });
  };

  return (
    <div style={{ marginLeft: "50px" }}>
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
      <Paper sx={{ width: "100%", overflow: "hidden", maxWidth: "1200px" }}>
        <TableContainer sx={{ maxHeight: 620 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ alignItems: "center" }}>
              <TableRow>
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
                      <IconButton onClick={() => deleteColumn(colIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  id="add-column-button"
                  style={{
                    backgroundColor: "#c5c5c5",
                    borderBottom: "2px solid grey",
                  }}
                >
                  <IconButton
                    onClick={addColumn}
                    /* style={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      fontWeight: "bold",
                    }} */
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((rowData, rowIndex) => (
                <TableRow key={rowIndex}>
                  {rowData.map((cellValue, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{
                        borderBottom: "1px solid #c5c5c5",
                      }}
                    >
                      <TextField
                        variant="standard"
                        InputProps={{
                          disableUnderline: !(
                            editingCell.row === rowIndex &&
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
                      borderBottom: "1px solid #c5c5c5",
                    }}
                  >
                    <IconButton onClick={() => deleteRow(rowIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div id="add-row-button" style={{ padding: "16px" }}>
          <IconButton
            onClick={addRow}
            /* style={{
              backgroundColor: "#1976d2",
              color: "white",
            }} */
          >
            <AddIcon />
          </IconButton>
        </div>
      </Paper>
    </div>
  );
};

export default EditableTable;
