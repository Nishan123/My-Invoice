import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import PropTypes from "prop-types";

const MAX_VISIBLE = 100;

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No matches found",
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      `${option.label} ${option.description ?? ""} ${option.meta ?? ""}`
        .toLowerCase()
        .includes(needle)
    );
  }, [options, query]);

  const visible = filtered.slice(0, MAX_VISIBLE);
  const hiddenCount = filtered.length - visible.length;

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActiveIndex(-1);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (option) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && visible[activeIndex]) choose(visible[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-left text-sm transition-colors hover:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={`truncate ${selected ? "text-gray-100" : "text-gray-400"}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl shadow-black/50">
          <div className="flex items-center gap-2 border-b border-gray-800 px-3 py-2">
            <Search size={16} className="shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <ul
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto py-1"
          >
            {visible.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</li>
            ) : (
              visible.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                      option.disabled
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer"
                    } ${isActive ? "bg-gray-800" : ""}`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Check size={14} className="shrink-0 text-blue-400" />
                        )}
                        <span className="truncate text-gray-100">
                          {option.label}
                        </span>
                      </div>
                      {option.description && (
                        <p className="truncate text-xs text-gray-500">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {option.meta && (
                      <span className="shrink-0 text-xs text-gray-400">
                        {option.meta}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {hiddenCount > 0 && (
            <div className="border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
              Showing first {MAX_VISIBLE} of {filtered.length}. Keep typing to
              narrow.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

SearchableSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      meta: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  emptyMessage: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchableSelect;
