const fs = require('fs');
const path = 'src/components/storefront-preview.tsx';
let code = fs.readFileSync(path, 'utf-8');

// 1. Import useRef
code = code.replace('import React, { useState } from "react";', 'import React, { useState, useRef } from "react";');

// 2. Add state and handlers
const stateCode = \`  const [layout, setLayout] = useState<"GRID" | "LIST">("GRID");
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // setTimeout(() => setHasDragged(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    setHasDragged(true);
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - startY) * 2;
    scrollContainerRef.current.scrollTop = scrollTop - walk;
  };
\`;

code = code.replace(\`  const [layout, setLayout] = useState<"GRID" | "LIST">("GRID");
  const [clickedItem, setClickedItem] = useState<string | null>(null);\`, stateCode);

// 3. Prevent click if dragged
const purchaseCode = \`  const handlePurchase = (id: string) => {
    if (hasDragged) return;
    setClickedItem(id);\`;

code = code.replace(\`  const handlePurchase = (id: string) => {
    setClickedItem(id);\`, purchaseCode);

// 4. Add handlers to container
const containerSearch = \`<div className={\\`relative w-full h-full overflow-y-auto no-scrollbar \${styles.wrapper}\\`} style={{ fontFamily: styles.wrapperFont }}>\`;

const containerReplace = \`<div 
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={\\`relative w-full h-full overflow-y-auto no-scrollbar \${styles.wrapper} \${isDragging ? 'cursor-grabbing' : 'cursor-auto'}\\`} 
      style={{ fontFamily: styles.wrapperFont }}
    >\`;

code = code.replace(containerSearch, containerReplace);

fs.writeFileSync(path, code, 'utf-8');
console.log("Patched storefront drag successfully!");
