import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface DropdownWithOptionsProps {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
}

const DropdownWithOptions: React.FC<DropdownWithOptionsProps> = ({
  options,
  selectedValue,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-1">
          {options.find((option) => option.value === selectedValue)?.label ||
            label}
          <ChevronsUpDown width={12}></ChevronsUpDown>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleOptionClick(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownWithOptions;
