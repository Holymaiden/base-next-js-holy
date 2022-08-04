import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
// ? @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from "@mui/material";
// ? routes
import { PATH_DASHBOARD } from "../../../src/routes/paths";
// ? hooks
import useTabs from "../../../src/hooks/useTabs";
import useSettings from "../../../src/hooks/useSettings";
import useToggle from "../../../src/hooks/useToggle";
import useTable, { emptyRows } from "../../../src/hooks/useTable";
// ? _mock_
import { _userList } from "../../../src/_mock";
// ? layouts
import Layout from "../../../src/layouts";
// ? components
import Page from "../../../src/components/Page";
import Iconify from "../../../src/components/Iconify";
import Scrollbar from "../../../src/components/Scrollbar";
import HeaderBreadcrumbs from "../../../src/components/HeaderBreadcrumbs";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from "../../../src/components/table";
// ? sections
import {
  UserTableToolbar,
  UserTableRow,
} from "../../../src/sections/@dashboard/user";
import UserForm from "../../../src/sections/@dashboard/user/UserForm";
import axios from "../../../src/utils/axios";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["all", "active", "banned"];

const ROLE_OPTIONS = ["all", "admin", "user"];

const TABLE_HEAD = [
  { id: "name", label: "Name", align: "left" },
  { id: "email", label: "Email", align: "left" },
  { id: "role", label: "Role", align: "left" },
  { id: "isVerified", label: "Verified", align: "center" },
  { id: "status", label: "Status", align: "left" },
  { id: "" },
];

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const {
    toggle: openFormNew,
    onOpen: onOpenFormNew,
    onClose: onCloseFormNew,
  } = useToggle();

  const {
    toggle: openFormEdit,
    onOpen: onOpenFormEdit,
    onClose: onCloseFormEdit,
  } = useToggle();

  const { themeStretch } = useSettings();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [selectedData, setSelectedData] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs("all");

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await axios.delete(`/api/user/${id}`).then((res) => {
      if (res.data.code !== 200)
        return enqueueSnackbar("Failed to delete user", { variant: "error" });
      enqueueSnackbar("User deleted", { variant: "success" });
    });
    setPage(0);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (data) => {
    onOpenFormEdit();
    setSelectedData(data);
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!tableData.length && !!filterName) ||
    (!tableData.length && !!filterRole) ||
    (!tableData.length && !!filterStatus);

  const getData = () => {
    axios
      .get(
        "/api/user?page=" +
          (page + 1) +
          "&limit=" +
          rowsPerPage +
          "&sort=" +
          orderBy +
          "&order=" +
          order +
          "&search=" +
          filterName +
          "&filter=" +
          filterRole +
          "&status=" +
          filterStatus
      )
      .then((res) => {
        if (res.data.code !== 200)
          return enqueueSnackbar(res.data.message, { variant: "error" });

        setTableData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, [page, order, orderBy, rowsPerPage, filterName, filterRole, filterStatus]);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "User", href: PATH_DASHBOARD.user.root },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={"eva:plus-fill"} />}
              onClick={onOpenFormNew}
            >
              New User
            </Button>
          }
        />
        <UserForm onClose={onCloseFormNew} open={openFormNew} />
        <UserForm
          onClose={onCloseFormEdit}
          selected={(selectedId) => userFormEdit?.id === selectedId}
          onSelect={(value) => setValue("userForm", value)}
          open={openFormEdit}
          isEdit
          currentUser={selectedData}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: "background.neutral" }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: "relative" }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton
                        color="primary"
                        onClick={() => handleDeleteRows(selected)}
                      >
                        <Iconify icon={"eva:trash-2-outline"} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? "small" : "medium"}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: "relative" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: "absolute" } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------
