"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X, Check } from "lucide-react";
import { Hero } from "./Hero";
import { JobCard } from "./JobCard";
import type { Job, JobBoardConfig } from "../types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobListViewProps {
  jobs: Job[];
  config: JobBoardConfig;
  textColor: string;
  isLoading?: boolean;
  onJobClick: (jobId: string) => void;
}

export const JobListView: React.FC<JobListViewProps> = ({
  jobs,
  config,
  textColor,
  isLoading = false,
  onJobClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [workTypeOpen, setWorkTypeOpen] = useState(false);

  const filterOptions = useMemo(() => {
    const departments = new Set<string>();
    const locations = new Set<string>();
    const workTypes = new Set<string>();

    jobs.forEach((job) => {
      if (job.department) departments.add(job.department);
      if (job.workType) workTypes.add(job.workType);

      if (job.locations) {
        job.locations.forEach((loc) => {
          if (loc.country) locations.add(loc.country);
        });
      } else if (job.location) {
        const parts = job.location.split(",").map((p) => p.trim());
        if (parts.length > 0) {
          locations.add(parts[parts.length - 1]);
        }
      }
    });

    return {
      departments: Array.from(departments).sort(),
      locations: Array.from(locations).sort(),
      workTypes: Array.from(workTypes).sort(),
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartments.length === 0 ||
        (job.department && selectedDepartments.includes(job.department));

      const matchesLocation =
        selectedLocations.length === 0 ||
        (() => {
          if (job.locations) {
            return job.locations.some(
              (loc) => loc.country && selectedLocations.includes(loc.country),
            );
          } else if (job.location) {
            return selectedLocations.some((selectedLoc) =>
              job.location!.includes(selectedLoc),
            );
          }
          return false;
        })();

      const matchesWorkType =
        selectedWorkTypes.length === 0 ||
        (job.workType && selectedWorkTypes.includes(job.workType));

      return (
        matchesSearch && matchesDepartment && matchesLocation && matchesWorkType
      );
    });
  }, [
    jobs,
    searchQuery,
    selectedDepartments,
    selectedLocations,
    selectedWorkTypes,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartments([]);
    setSelectedLocations([]);
    setSelectedWorkTypes([]);
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  };

  const toggleWorkType = (type: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const hasActiveFilters =
    searchQuery ||
    selectedDepartments.length > 0 ||
    selectedLocations.length > 0 ||
    selectedWorkTypes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        x: -30,
        transition: { duration: 0.2, ease: "easeIn" },
      }}
      className="min-h-screen flex flex-col"
    >
      <Hero config={config} textColor={textColor} />

      <div className="bg-gray-50 flex-1 border-t border-gray-100">
        {jobs.length === 0 && isLoading ? (
          <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8 @2xl:py-12">
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-6 border-b border-gray-200 px-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
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
            <div className="@2xl:sticky @2xl:top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 py-4">
              <div className="max-w-7xl mx-auto px-6 @2xl:px-10">
                <div className="flex flex-col @2xl:flex-row items-stretch @2xl:items-center gap-6 @2xl:gap-2">
                  <div className="relative w-full @2xl:flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-sm text-gray-900 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <Popover
                    open={departmentOpen}
                    onOpenChange={setDepartmentOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-between w-full @2xl:flex-1",
                          selectedDepartments.length > 0 && "border-foreground",
                        )}
                      >
                        <span className="truncate">
                          {selectedDepartments.length === 0
                            ? "Department"
                            : selectedDepartments.length === 1
                              ? selectedDepartments[0]
                              : `${selectedDepartments.length} selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search departments..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
                          <CommandGroup>
                            {filterOptions.departments.map((dept) => {
                              const isSelected =
                                selectedDepartments.includes(dept);
                              return (
                                <CommandItem
                                  key={dept}
                                  value={dept}
                                  onSelect={() => toggleDepartment(dept)}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "opacity-50",
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </div>
                                  {dept}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-between w-full @2xl:flex-1",
                          selectedLocations.length > 0 && "border-foreground",
                        )}
                      >
                        <span className="truncate">
                          {selectedLocations.length === 0
                            ? "Location"
                            : selectedLocations.length === 1
                              ? selectedLocations[0]
                              : `${selectedLocations.length} selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search locations..." />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {filterOptions.locations.map((loc) => {
                              const isSelected =
                                selectedLocations.includes(loc);
                              return (
                                <CommandItem
                                  key={loc}
                                  value={loc}
                                  onSelect={() => toggleLocation(loc)}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "opacity-50",
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </div>
                                  {loc}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Popover open={workTypeOpen} onOpenChange={setWorkTypeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "justify-between w-full @2xl:flex-1",
                          selectedWorkTypes.length > 0 && "border-foreground",
                        )}
                      >
                        <span className="truncate">
                          {selectedWorkTypes.length === 0
                            ? "Work Type"
                            : selectedWorkTypes.length === 1
                              ? selectedWorkTypes[0]
                              : `${selectedWorkTypes.length} selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search work types..." />
                        <CommandList>
                          <CommandEmpty>No work type found.</CommandEmpty>
                          <CommandGroup>
                            {filterOptions.workTypes.map((type) => {
                              const isSelected =
                                selectedWorkTypes.includes(type);
                              return (
                                <CommandItem
                                  key={type}
                                  value={type}
                                  onSelect={() => toggleWorkType(type)}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "opacity-50",
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </div>
                                  {type}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-muted-foreground w-full @2xl:w-auto"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {(selectedDepartments.length > 0 ||
                  selectedLocations.length > 0 ||
                  selectedWorkTypes.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {selectedDepartments.map((dept) => (
                      <Badge
                        key={dept}
                        variant="secondary"
                        className="gap-1.5 pl-2.5 pr-1.5"
                      >
                        <span className="text-xs">{dept}</span>
                        <button
                          onClick={() => toggleDepartment(dept)}
                          className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedLocations.map((loc) => (
                      <Badge
                        key={loc}
                        variant="secondary"
                        className="gap-1.5 pl-2.5 pr-1.5"
                      >
                        <span className="text-xs">{loc}</span>
                        <button
                          onClick={() => toggleLocation(loc)}
                          className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedWorkTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="gap-1.5 pl-2.5 pr-1.5"
                      >
                        <span className="text-xs">{type}</span>
                        <button
                          onClick={() => toggleWorkType(type)}
                          className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 @2xl:px-10 py-8 @2xl:py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Open Roles
              </h2>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No jobs found matching your criteria.
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job, idx) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => onJobClick(job.id)}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
