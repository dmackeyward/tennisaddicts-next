"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  MutableRefObject,
} from "react";

interface MultiSelectorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  values: string[];
  onValuesChange: (value: string[]) => void;
  loop?: boolean;
  disabled?: boolean; // Add disabled prop to interface
}

interface MultiSelectContextProps {
  value: string[];
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  disabled?: boolean; // Add disabled to context
}

const MultiSelectContext = createContext<MultiSelectContextProps | undefined>(
  undefined
);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  disabled = false, // Default to false
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isValueSelected, setIsValueSelected] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (disabled) return; // Skip if disabled

      if (value.includes(val)) {
        onValueChange(value.filter((item) => item !== val));
      } else {
        onValueChange([...value, val]);
      }
    },
    [value, onValueChange, disabled]
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      if (disabled) return; // Skip if disabled

      e.preventDefault();
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0
      );

      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue, disabled]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return; // Skip if disabled

      e.stopPropagation();
      const target = inputRef.current;

      if (!target) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              const selectedValue = value[activeIndex];
              if (selectedValue !== undefined) {
                onValueChangeHandler(selectedValue);
                moveCurrent();
              }
            } else {
              if (target.selectionStart === 0) {
                const lastValue = value[value.length - 1];
                if (
                  lastValue !== undefined &&
                  (selectedValue === inputValue || isValueSelected)
                ) {
                  onValueChangeHandler(lastValue);
                }
              }
            }
          }
          break;

        case "Enter":
          setOpen(true);
          break;

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setOpen(false);
          }
          break;
      }
    },
    [
      value,
      inputValue,
      activeIndex,
      loop,
      dir,
      onValueChangeHandler,
      selectedValue,
      isValueSelected,
      open,
      disabled,
    ]
  );

  // Only allow opening the selector if not disabled
  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      if (!disabled) {
        setOpen(newOpen);
      }
    },
    [disabled]
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen: handleSetOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        inputRef,
        handleSelect,
        disabled,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-col space-y-2 overflow-visible bg-transparent",
          className,
          disabled && "opacity-70 pointer-events-none" // Add disabled styling
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange, activeIndex, disabled } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-1 rounded-lg bg-background p-1 py-2 ring-1 ring-muted",
        {
          "ring-1 focus-within:ring-ring": activeIndex === -1,
          "opacity-70 cursor-not-allowed": disabled, // Add disabled styling
        },
        className
      )}
      {...props}
    >
      {value.map((item, index) => (
        <Badge
          key={item}
          className={cn(
            "flex items-center gap-1 rounded-xl px-1",
            activeIndex === index && "ring-2 ring-muted-foreground"
          )}
          variant={"secondary"}
        >
          <span className="text-xs">{item}</span>
          <button
            aria-label={`Remove ${item} option`}
            aria-roledescription="button to remove option"
            type="button"
            onMouseDown={mousePreventDefault}
            onClick={() => !disabled && onValueChange(item)}
            disabled={disabled}
          >
            <span className="sr-only">Remove {item} option</span>
            <RemoveIcon
              className={cn(
                "h-4 w-4 hover:stroke-destructive",
                disabled && "hover:stroke-current"
              )}
            />
          </button>
        </Badge>
      ))}
      {children}
    </div>
  );
});

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    handleSelect,
    disabled,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={disabled ? -1 : 0} // Make non-focusable when disabled
      ref={ref}
      value={inputValue}
      onValueChange={
        activeIndex === -1 && !disabled ? setInputValue : undefined
      }
      onSelect={handleSelect}
      onBlur={() => setOpen(false)}
      onFocus={() => !disabled && setOpen(true)}
      onClick={() => !disabled && setActiveIndex(-1)}
      disabled={disabled} // Add native disabled attribute
      className={cn(
        "ml-2 flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-muted-foreground",
        className,
        activeIndex !== -1 && "caret-transparent",
        disabled && "cursor-not-allowed"
      )}
    />
  );
});

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { children, ...rest } = props;
  const { open, disabled } = useMultiSelect();

  // Don't render content if disabled
  return (
    <div ref={ref} className="relative" {...rest}>
      {open && !disabled && children}
    </div>
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg absolute top-0 z-10 flex w-full flex-col gap-2 rounded-md border border-muted bg-background p-2 shadow-md transition-colors",
        className
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">No results found</span>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, children, ...props }, ref) => {
  const {
    value: Options,
    onValueChange,
    setInputValue,
    disabled: contextDisabled,
  } = useMultiSelect();

  // Combine component disabled prop with context disabled
  const isDisabled = props.disabled || contextDisabled;

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isIncluded = Options.includes(value);
  return (
    <CommandItem
      ref={ref}
      {...props}
      disabled={isDisabled} // Pass combined disabled state
      onSelect={() => {
        if (!isDisabled) {
          onValueChange(value);
          setInputValue("");
        }
      }}
      className={cn(
        "flex cursor-pointer justify-between rounded-md px-2 py-1 transition-colors",
        className,
        isIncluded && "cursor-default opacity-50",
        isDisabled && "cursor-not-allowed opacity-50"
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
