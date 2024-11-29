import { useEffect, useState, useCallback } from "react";

export function useMousePick() {
    const [mouse, setMouse] = useState<[number, number]>([0, 0]);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [isMouseUp, setIsMouseUp] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // Xử lý khi di chuyển chuột
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMouse([
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
        ]);
        if (isMouseDown) {
            setIsDragging(true); // Bật kéo nếu chuột đang được giữ
        }
    }, [isMouseDown]);

    // Xử lý khi nhấn chuột
    const handleMouseDown = useCallback(() => {
        setIsMouseDown(true);
        setIsDragging(false); // Reset kéo khi bắt đầu nhấn
    }, []);

    // Xử lý khi nhả chuột
    const handleMouseUp = useCallback(() => {
        setIsMouseUp(true);
        setIsMouseDown(false);
        setIsDragging(false); // Ngừng kéo khi nhả chuột
        setTimeout(() => setIsMouseUp(false), 100); // Reset isMouseUp sau 100ms
    }, []);

    // Thêm sự kiện chuột vào window
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp]);

    return { mouse, isMouseDown, isMouseUp, isDragging };
}
