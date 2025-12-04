"use client";

import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FieldLabel } from "@measured/puck";
import { Check, ChevronsUpDown } from "lucide-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

const StrapiIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 600 600"
    >
        <path
            fill="#4945FF"
            d="M0 208C0 109.948 0 60.922 30.46 30.46 60.923 0 109.949 0 208 0h184c98.052 0 147.078 0 177.539 30.46C600 60.923 600 109.949 600 208v184c0 98.052 0 147.078-30.461 177.539S490.052 600 392 600H208c-98.052 0-147.078 0-177.54-30.461C0 539.078 0 490.052 0 392z"
        />
        <path
            fill="#fff"
            fillRule="evenodd"
            d="M414 182H212v103h103v103h103V186a4 4 0 0 0-4-4"
            clipRule="evenodd"
        />
        <path fill="#fff" d="M311 285h4v4h-4z" />
        <path
            fill="#9593FF"
            d="M212 285h99a4 4 0 0 1 4 4v99h-99a4 4 0 0 1-4-4zM315 388h103l-99.586 99.586c-1.26 1.26-3.414.367-3.414-1.414zM212 285h-98.172c-1.782 0-2.674-2.154-1.414-3.414L212 182z"
        />
    </svg>
);

const requestContent = (data: any) => {
    if (window.parent) {
        window.parent.postMessage({ type: "request_content", data }, "*");
    }
};

const StrapiComponent = ({
    field,
    name,
    url,
    authToken,
    value,
    locale,
    onChange,
}: {
    field: any;
    name: string;
    url?: string;
    authToken?: string;
    value: any;
    locale?: string;
    onChange: (value: any) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const fetchContent = useCallback(
        (query: string) => {
            if (!name || !field?.contentType) return;
            setLoading(true);
            requestContent({
                target: name,
                contentType: field.contentType,
                searchQuery: query,
                locale: locale,
                titleField: field.titleField,
            });
        },
        [name, field?.contentType, locale, field?.titleField]
    );

    // Debounce search
    const debouncedFetch = useCallback(
        debounce((query: string) => {
            setDebouncedSearch(query);
        }, 500),
        []
    );

    useEffect(() => {
        if (debouncedSearch.length > 2) {
            fetchContent(debouncedSearch);
        }
    }, [debouncedSearch, fetchContent]);

    const handleSearchChange = useCallback(
        (val: string) => {
            setSearch(val);
            debouncedFetch(val);
        },
        [debouncedFetch]
    );

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (data.type === "return_content" && data.data.target === name) {
                const { content } = data.data;
                setItems(content);
                setLoading(false);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [name]);

    // Initial fetch
    useEffect(() => {
        fetchContent("");
    }, []);

    const collectionName =
        field?.contentType?.split("::")?.[1]?.split(".")?.[0] || field?.contentType;

    return (
        <FieldLabel label={field.label || name || ""} icon={<StrapiIcon />}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild style={{ width: "100%" }}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? (items || []).find((i) => i.documentId === value.documentId)
                                ?.title || value.title || value.documentId
                            : `Select ${collectionName}`}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            value={search}
                            onValueChange={handleSearchChange}
                            placeholder={`Find a ${collectionName}`}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {loading ? "Loading..." : `No content found. ${items.length}`}
                            </CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.documentId}
                                        value={item.documentId}
                                        onSelect={(currentValue) => {
                                            if (value?.documentId === currentValue) {
                                                onChange(null);
                                            } else {
                                                onChange({ documentId: currentValue });
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        {item.title}
                                        <Check
                                            style={{
                                                marginLeft: "auto",
                                                opacity: value?.documentId === item.documentId ? 1 : 0,
                                            }}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </FieldLabel>
    );
};

export default StrapiComponent;
