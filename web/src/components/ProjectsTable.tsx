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
    cell: info => <span className="text-muted">{info.getValue()}</span>,
  }),
  columnHelper.accessor("featured", {
    header: "Istaknut",
    sortFn: "basic",
    cell: info =>
      info.getValue() ? <span className="text-accent">Da</span> : <span className="text-muted/60">Ne</span>,
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
        className="w-full max-w-xs rounded-lg border border-line bg-card px-4 py-2 text-sm text-fg placeholder:text-muted/60 outline-none transition-colors focus:border-accent"
      />

      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-5 py-3 font-medium">
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-fg"
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
          <tbody className="divide-y divide-line">
            {rows.map(row => (
              <tr key={row.id} className="transition-colors hover:bg-bg/50">
                {row.getAllCells().map(cell => (
                  <td key={cell.id} className="px-5 py-3">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Nema projekata za "{search}"</p>}
      </div>
    </div>
  );
}
