import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Project } from "../types";
import { DeleteButton } from "./DeleteButton";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { text: sortFn_text, basic: sortFn_basic },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

const columnHelper = createColumnHelper<typeof features, Project>();

const columns = columnHelper.columns([
  columnHelper.accessor("title", {
    header: "Naslov",
    sortFn: "text",
    cell: info => (
      <Link
        to="/admin/projects/$slug/edit"
        params={{ slug: info.row.original.slug }}
        className="font-medium hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor(row => row.technologies.join(", "), {
    id: "technologies",
    header: "Tehnologije",
    sortFn: "text",
    cell: info => <span className="text-zinc-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor("featured", {
    header: "Istaknut",
    sortFn: "basic",
    cell: info =>
      info.getValue() ? <span className="text-emerald-400">Da</span> : <span className="text-zinc-600">Ne</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Datum",
    sortFn: "basic",
    cell: info => new Date(info.getValue()).toLocaleDateString("sr-RS"),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: info => <DeleteButton slug={info.row.original.slug} />,
  }),
]);

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const table = useTable({
    features,
    columns,
    data: projects,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: column => column.id === "title" || column.id === "technologies",
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Pretraži projekte..."
        className="w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-zinc-400"
      />

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-zinc-500">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-5 py-3 font-medium">
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        <table.FlexRender header={header} />
                        {header.column.getIsSorted() === "asc" && " ↑"}
                        {header.column.getIsSorted() === "desc" && " ↓"}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-zinc-900">
                {row.getAllCells().map(cell => (
                  <td key={cell.id} className="px-5 py-3">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && <p className="px-5 py-6 text-center text-zinc-500">Nema projekata za "{search}"</p>}
      </div>
    </div>
  );
}
