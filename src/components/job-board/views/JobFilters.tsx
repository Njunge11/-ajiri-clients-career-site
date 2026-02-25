"use client";

import React from "react";
import { Search, ChevronDown, X, Check } from "lucide-react";
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

interface FilterOption {
  label: string;
  placeholder: string;
  emptyMessage: string;
  options: string[];
  selected: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (value: string) => void;
}

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOption[];
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  hasActiveFilters,
  onClearAll,
}) => {
  const hasBadges = filters.some((f) => f.selected.length > 0);

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm text-gray-900 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
            />
          </div>

          {filters.map((filter) => (
            <Popover
              key={filter.label}
              open={filter.open}
              onOpenChange={filter.onOpenChange}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-between w-full @2xl:flex-1",
                    filter.selected.length > 0 && "border-foreground",
                  )}
                >
                  <span className="truncate">
                    {filter.selected.length === 0
                      ? filter.label
                      : filter.selected.length === 1
                        ? filter.selected[0]
                        : `${filter.selected.length} selected`}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder={filter.placeholder} />
                  <CommandList>
                    <CommandEmpty>{filter.emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {filter.options.map((option) => {
                        const isSelected = filter.selected.includes(option);
                        return (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={() => filter.onToggle(option)}
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
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            {option}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className={cn(
              "text-xs text-muted-foreground w-full @2xl:w-auto transition-opacity",
              hasActiveFilters ? "visible opacity-100" : "invisible opacity-0",
            )}
          >
            Clear all
          </Button>
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            hasBadges ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {filters.flatMap((filter) =>
                filter.selected.map((value) => (
                  <Badge
                    key={`${filter.label}-${value}`}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-1.5"
                  >
                    <span className="text-xs">{value}</span>
                    <button
                      onClick={() => filter.onToggle(value)}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
