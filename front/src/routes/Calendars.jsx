import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCalendars, fetchCalendars } from '../utils/api_calls';

import AddCalendar from '../utils/AddCalendar';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'url', headerName: 'URL', width: 130 },
  { field: 'calendarName', headerName: 'name', width: 130 },
  { field: 'ttl', headerName: 'time before reminding', width: 150 },
];

export default function Calendars() {
  const [selectedIds, setSelectedIds] = useState();
  const [rows, setRows] = useState([]);

  const fetchData = () => fetchCalendars().then((res) => setRows(res.calendars.map((x) => ({
    id: x.calendarId,
    url: x.calendarUrl,
    calendarName: x.calendarName,
    ttl: x.ttl,
  }))));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color="error"
          variant="contained"
          onClick={async () => {
            console.log(selectedIds);
            deleteCalendars({ ids: selectedIds }).then(() => fetchData());
          }}
          sx={{ mt: 1 }}
        >
          Delete selected
          <DeleteIcon />
        </Button>

      </div>
      <AddCalendar reFetch={fetchData} />
    </>
  );
}
