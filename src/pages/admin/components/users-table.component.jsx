import LoadingOverlay from "@/components/shared/loading-overlay.component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllUsersQuery } from "@/hooks/queries";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";
import { useMemo, useState } from "preact/hooks";
import EditUserModal from "./edit-user-modal.component";
import { USER_TYPE_ENUM, USER_TYPE_ENUM_TO_READABLE } from "@/constants";
import { Progress } from "@/components/ui/progress";

const columnHelper = createColumnHelper();

const UsersTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [userToEditTgId, setUserToEditTgId] = useState(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: usersData, isFetching } = useGetAllUsersQuery();

  const columns = useMemo(
    () => [
      columnHelper.accessor("first_name", {
        filterFn: "includesString",
        sortingFn: "alphanumeric",
        header: ({ column }) => {
          return (
            <Button
              className="px-2"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              الاسم الاول
              <ArrowUpDownIcon className="ms-2 h-4 w-4" />
            </Button>
          );
        },
      }),

      columnHelper.accessor("last_name", {
        filterFn: "includesString",
        sortingFn: "alphanumeric",
        header: ({ column }) => {
          return (
            <Button
              className="px-2"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              الاسم الاخير
              <ArrowUpDownIcon className="ms-2 h-4 w-4" />
            </Button>
          );
        },
      }),

      columnHelper.accessor("username", {
        filterFn: "includesString",
        sortingFn: "alphanumeric",
        cell: ({ getValue }) => {
          if (!getValue()) return "";

          return (
            <a
              className="text-cyan-500"
              target="_blank"
              rel="noreferrer"
              href={`https://t.me/${getValue()}`}
            >
              {`${getValue()}`}
            </a>
          );
        },
        header: ({ column }) => {
          return (
            <Button
              className="px-2"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              اسم المستخدم
              <ArrowUpDownIcon className="ms-2 h-4 w-4" />
            </Button>
          );
        },
      }),
      columnHelper.accessor((row) => row.bot_user_preferences?.nickname, {
        id: "nickname",
        filterFn: "includesString",
        header: ({ column }) => {
          return (
            <Button
              className="px-2"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              الاسم المستعار
              <ArrowUpDownIcon className="ms-2 h-4 w-4" />
            </Button>
          );
        },
      }),

      columnHelper.accessor("created_at", {
        sortingFn: "datetime", // use built-in sorting function by name,
        cell: ({ cell }) => {
          return new Intl.DateTimeFormat("ar-SY", {
            dateStyle: "full",
            timeStyle: "medium",
          }).format(new Date(cell.getValue()));
        },
        header: ({ column }) => {
          return (
            <Button
              className="px-2"
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              تاريخ التسجيل
              <ArrowUpDownIcon className="ms-2 h-4 w-4" />
            </Button>
          );
        },
      }),

      columnHelper.accessor((row) => row.bot_user_preferences?.user_type, {
        id: "user_type",
        header: "نوع المستخدم",
        filterFn: "equals",

        cell: ({ cell }) => USER_TYPE_ENUM_TO_READABLE[cell.getValue()],
      }),

      columnHelper.accessor(
        (row) => row.bot_user_preferences?.will_to_provide,
        {
          id: "will_to_provide",
          filterFn: "equals",
          sortingFn: "basic",
          header: ({ column }) => {
            return (
              <Button
                className="px-2"
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                الاولوية في تقديم الرعاية
                <ArrowUpDownIcon className="ms-2 h-4 w-4" />
              </Button>
            );
          },

          cell: ({ cell }) => {
            if (
              cell.row.original.bot_user_preferences?.user_type ===
              USER_TYPE_ENUM.Consumer
            )
              return "";
            return <Progress value={cell.getValue() * 20} />;
          },
        },
      ),

      columnHelper.display({
        id: "actions",
        cell: ({ cell }) => (
          <Button
            size="sm"
            onClick={() => setUserToEditTgId(cell.row.original.tg_id)}
          >
            تعديل
          </Button>
        ),
      }),
    ],
    [],
  );
  const memoRows = useMemo(() => usersData?.data ?? [], [usersData]);
  const table = useReactTable({
    data: memoRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableGlobalFilter: true,
    onGlobalFilterChange: setSearchQuery,
    getRowId: (row) => row.tg_id,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter: debouncedSearchQuery,
    },
  });
  return (
    <div className="w-full flex flex-col gap-2 h-full">
      <div className="flex gap-2 items-center flex-col lg:flex-row mb-2">
        <div className="ml-auto flex-shrink-0 bg-secondary p-1.5 px-4 rounded-sm w-full md:w-fit">
          <p className="text-lg font-semibold">
            العدد الكلي للسمتخدمين : ( {usersData?.count} )
          </p>
        </div>
        <Input
          disabled={isFetching}
          placeholder="البحث"
          value={searchQuery}
          onInput={(e) => table.setGlobalFilter(e.target.value)}
          className=""
        />
        <Select
          disabled={isFetching}
          defaultValue={null}
          onValueChange={(v) => {
            return table.getColumn("user_type").setFilterValue(v);
          }}
        >
          <SelectTrigger className="lg:w-[250px] flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            ref={(ref) => {
              if (!ref) return;
              ref.ontouchstart = (e) => {
                e.preventDefault();
              };
            }}
          >
            <SelectItem value={null}>كل المستخدمين</SelectItem>
            <SelectItem value={USER_TYPE_ENUM.Consumer}>
              المستفيدين فقط
            </SelectItem>

            <SelectItem value={USER_TYPE_ENUM.Provider}>
              المتطوعين فقط
            </SelectItem>
            <SelectItem value={USER_TYPE_ENUM.Specialist}>
              المختصين فقط
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border relative flex-1">
        {isFetching && <LoadingOverlay />}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-start">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-start">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !isFetching && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {usersData.error ? (
                        <p className="text-red-500">حدث خطأ</p>
                      ) : (
                        <p>لا يوجد بيانات لعرضها</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={isFetching || !table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <div className="px-2">
            <p>
              الصفحة {pagination.pageIndex + 1} من {table.getPageCount()}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={isFetching || !table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
      {!!userToEditTgId && (
        <EditUserModal
          userToEditTgId={userToEditTgId}
          onClose={() => setUserToEditTgId(0)}
        />
      )}
    </div>
  );
};

export default UsersTable;
