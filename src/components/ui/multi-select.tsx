"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { useCallback, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CommandEmpty } from "cmdk";

export type MultiSelectOption = Record<"value" | "label", string>;

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  values: MultiSelectOption[];
  onValuesChange: (value: MultiSelectOption[]) => void;
}

export function MultiSelectDropdown({
  options,
  values,
  onValuesChange,
}: MultiSelectDropdownProps) {
  const [selectedOptions, setSelectedOptions] =
    React.useState<MultiSelectOption[]>(values);

  const [newOptions, setNewOptions] =
    React.useState<MultiSelectOption[]>(options);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  function toggleOption(selected: boolean, option: MultiSelectOption) {
    if (selected) {
      setSelectedOptions((prevSelectedOptions) => {
        const updatedOptions = [...prevSelectedOptions, option];
        if (!options.map((option) => option.value).includes(option.value)) {
          setNewOptions([...newOptions, option]);
        }
        onValuesChange(updatedOptions); // Call onValuesChange with the updated value
        return updatedOptions;
      });
    } else {
      setSelectedOptions((prevSelectedOptions) => {
        const updatedOptions = prevSelectedOptions.filter(
          (item) => item.value !== option.value
        );
        if (!options.map((option) => option.value).includes(option.value)) {
          setNewOptions(
            newOptions.filter((item) => item.value !== option.value)
          );
        }
        onValuesChange(updatedOptions); // Call onValuesChange with the updated value
        return updatedOptions;
      });
    }
  }

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className="w-full">
        <div
          className={
            "flex flex-wrap w-full min-h-8 gap-1 p-1 py-2 border border-muted rounded-lg bg-background"
          }
        >
          {selectedOptions.map((item, index) => (
            <Badge
              key={index}
              className={cn(
                "px-1 rounded-xl flex items-center gap-1"
                // activeIndex === index && "ring-2 ring-muted-foreground "
              )}
              variant={"secondary"}
            >
              <span className="text-xs">{item.label}</span>
              <div
                aria-label={`Remove ${item} option`}
                aria-roledescription="button to remove option"
                onMouseDown={mousePreventDefault}
                onClick={(e) => {
                  mousePreventDefault(e);
                  toggleOption(false, item);
                }}
              >
                <span className="sr-only">Remove {item.label} option</span>
                <X className="h-4 w-4 hover:stroke-destructive" />
              </div>
            </Badge>
          ))}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Type a command or search..."
            value={value}
            onValueChange={(value) => setValue(value)}
          />
          <CommandList>
            {newOptions.map((option, index) => (
              <CommandItem
                key={index}
                value={option.value}
                onSelect={(item) =>
                  toggleOption(
                    !selectedOptions
                      .map((option) => option.value)
                      .includes(item),
                    option
                  )
                }
                //   checked={selectedOptions.includes(option)}
                //   onCheckedChange={(selected) => toggleOption(selected, option)}
                className="flex gap-2 items-center"
              >
                <div className="w-4 h-4">
                  {selectedOptions
                    .map((option) => option.value)
                    .includes(option.value) && (
                    <Check width={16} height={16}></Check>
                  )}
                </div>
                {option.label} ({option.value})
              </CommandItem>
            ))}
            {value != "" &&
              !newOptions.map((option) => option.value).includes(value) && (
                <CommandItem
                  value={value}
                  onSelect={(option) =>
                    toggleOption(
                      !selectedOptions
                        .map((option) => option.value)
                        .includes(option),
                      {
                        label: option,
                        value: option,
                      }
                    )
                  }
                  //   checked={selectedOptions.includes(option)}
                  //   onCheckedChange={(selected) => toggleOption(selected, option)}
                  className="flex gap-2 items-center"
                >
                  <div className="w-4 h-4"></div>
                  {`Create "${value}"`}
                </CommandItem>
              )}
          </CommandList>{" "}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
