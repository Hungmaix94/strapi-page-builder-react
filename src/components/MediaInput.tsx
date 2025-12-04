"use client";

import { FieldLabel } from "@measured/puck";
import {
    File,
    FileAudio,
    FileImage,
    FileVideo,
    Package,
    Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PlaceholderIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 512 512"
    >
        <rect
            width="416"
            height="352"
            x="48"
            y="80"
            fill="none"
            stroke="#000"
            strokeLinejoin="round"
            strokeWidth="32"
            rx="48"
            ry="48"
        />
        <circle
            cx="336"
            cy="176"
            r="32"
            fill="none"
            stroke="#000"
            strokeMiterlimit="10"
            strokeWidth="32"
        />
        <path
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="m304 335.79-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0 1 43.11-2L464 368"
        />
    </svg>
);

const requestMedia = (data: any) => {
    if (window.parent) {
        window.parent.postMessage({ type: "request_media", data }, "*");
    }
};

const MediaInput = ({
    field,
    name,
    onChange,
    value,
    imageUrl,
}: {
    field: any;
    name: string;
    onChange: (value: string) => void;
    value: string;
    imageUrl?: string;
}) => {
    const mediaType = field.mediaType || "all";
    const Icon = useMemo(() => {
        switch (mediaType) {
            case "image":
                return FileImage;
            case "video":
                return FileVideo;
            case "audio":
                return FileAudio;
            case "file":
                return File;
            default:
                return Package;
        }
    }, [mediaType]);

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (data.type === "return_media" && data.data.target === name) {
                onChange(data.data.src);
                setIsOpen(false);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [name, onChange]);

    const handleOpen = () => {
        setIsOpen(true);
        requestMedia({ target: name, value: value || "", type: mediaType });
    };

    const handleClear = () => {
        onChange("");
        setIsOpen(false);
        setIsHovered(false);
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
            }}
        >
            <FieldLabel
                label={field.label || name || ""}
                icon={<Icon height={16} width={16} />}
            />
            <div
                style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    border: "1px solid #dcdcdc",
                    borderRadius: "5px",
                    overflow: "hidden",
                    background:
                        "repeating-conic-gradient(#f6f6f9 0% 25%, transparent 0% 50%) 50%/20px 20px",
                }}
                onMouseEnter={() => {
                    if (value) setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button type="button" onClick={handleOpen}>
                    {value ? (
                        <img
                            src={`${value.indexOf("http") === -1 ? imageUrl || "" : ""}${value}`}
                            alt={field.label || "Thumbnail"}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "contain",
                                padding: "0.3rem",
                            }}
                        />
                    ) : (
                        <PlaceholderIcon />
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "auto",
                        backgroundColor: "#ffffff",
                        border: "1px solid #dcdcdc",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        padding: "0.5rem",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.1s ease-in-out",
                    }}
                >
                    <Trash2 height={16} />
                </button>
            </div>
        </div>
    );
};

export default MediaInput;
