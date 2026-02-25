"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useOptimistic,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { JobCard } from "./JobCard";
import { JobFilters } from "./JobFilters";
import { useJobBoardState } from "../context";
import type { Job, JobFacets, FacetOption } from "../types";

function buildValueMap(options: FacetOption[]) {
  return {
    labelToValue: new Map(options.map((o) => [o.label, o.value])),
    valueToLabel: new Map(options.map((o) => [o.value, o.label])),
  };
}

interface ActiveFilters {
  departments: string[];
  locations: string[];
  workTypes: string[];
}

interface JobListViewProps {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  facets: JobFacets;
  activeFilters: ActiveFilters;
}

export const JobListView: React.FC<JobListViewProps> = ({
  jobs,
  total,
  page,
  pageSize,
  facets,
  activeFilters,
}) => {
  const { slug } = useJobBoardState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticFilters, setOptimisticFilters] =
    useOptimistic(activeFilters);

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [workTypeOpen, setWorkTypeOpen] = useState(false);

  // Search: local state + debounce (correct pattern for continuous typing)
  const currentSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/${slug}?${params.toString()}`);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Build label↔value maps from API facets
  const deptMaps = useMemo(
    () => buildValueMap(facets.departments),
    [facets.departments],
  );
  const locMaps = useMemo(
    () => buildValueMap(facets.locations),
    [facets.locations],
  );
  const wtMaps = useMemo(
    () => buildValueMap(facets.workTypes),
    [facets.workTypes],
  );

  // Filters: useOptimistic for instant toggle, startTransition links to router.push
  const toggleFilter = (
    filterKey: keyof ActiveFilters,
    urlKey: string,
    label: string,
    labelToValue: Map<string, string>,
  ) => {
    const value = labelToValue.get(label) ?? label;
    const current = optimisticFilters[filterKey];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = { ...optimisticFilters, [filterKey]: updated };

    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set(urlKey, updated.join(","));
    } else {
      params.delete(urlKey);
    }
    params.delete("page");

    startTransition(() => {
      setOptimisticFilters(newFilters);
      router.push(`/${slug}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      setOptimisticFilters({ departments: [], locations: [], workTypes: [] });
      router.push(`/${slug}`);
    });
  };

  const hasActiveFilters =
    searchInput ||
    optimisticFilters.departments.length > 0 ||
    optimisticFilters.locations.length > 0 ||
    optimisticFilters.workTypes.length > 0;

  const filters = [
    {
      label: "Department",
      placeholder: "Search departments...",
      emptyMessage: "No department found.",
      options: facets.departments.map((o) => o.label),
      selected: optimisticFilters.departments.map(
        (v) => deptMaps.valueToLabel.get(v) ?? v,
      ),
      open: departmentOpen,
      onOpenChange: setDepartmentOpen,
      onToggle: (v: string) =>
        toggleFilter("departments", "department", v, deptMaps.labelToValue),
    },
    {
      label: "Location",
      placeholder: "Search locations...",
      emptyMessage: "No location found.",
      options: facets.locations.map((o) => o.label),
      selected: optimisticFilters.locations.map(
        (v) => locMaps.valueToLabel.get(v) ?? v,
      ),
      open: locationOpen,
      onOpenChange: setLocationOpen,
      onToggle: (v: string) =>
        toggleFilter("locations", "location", v, locMaps.labelToValue),
    },
    {
      label: "Work Type",
      placeholder: "Search work types...",
      emptyMessage: "No work type found.",
      options: facets.workTypes.map((o) => o.label),
      selected: optimisticFilters.workTypes.map(
        (v) => wtMaps.valueToLabel.get(v) ?? v,
      ),
      open: workTypeOpen,
      onOpenChange: setWorkTypeOpen,
      onToggle: (v: string) =>
        toggleFilter("workTypes", "workType", v, wtMaps.labelToValue),
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-gray-50 flex-1 border-t border-gray-100">
      {jobs.length === 0 && !hasActiveFilters ? (
        <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-16 @2xl:py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No open positions
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            We don&apos;t have any openings right now, but check back soon for
            new opportunities.
          </p>
        </div>
      ) : (
        <>
          <JobFilters
            searchQuery={searchInput}
            onSearchChange={handleSearchChange}
            filters={filters}
            hasActiveFilters={!!hasActiveFilters}
            onClearAll={clearFilters}
          />

          <div
            className={`max-w-7xl mx-auto px-6 @2xl:px-10 py-8 @2xl:py-12 transition-opacity ${isPending ? "opacity-60" : ""}`}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Open Roles
              <span className="text-base font-normal text-gray-400 ml-2">
                ({total})
              </span>
            </h2>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No jobs found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-gray-900 underline hover:no-underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((job, idx) => (
                    <JobCard key={job.id} job={job} index={idx} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    {page > 1 && (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          params.set("page", String(page - 1));
                          router.push(`/${slug}?${params.toString()}`);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    <span className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(
                            searchParams.toString(),
                          );
                          params.set("page", String(page + 1));
                          router.push(`/${slug}?${params.toString()}`);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
