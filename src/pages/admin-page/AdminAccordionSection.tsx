import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export function AdminAccordionSection({
  title, children, defaultOpen = true
}: {title:string,children:React.ReactNode,defaultOpen?:boolean}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="admin__section">
      <div className="admin__header" onClick={()=>setOpen(o=>!o)}>
        <div className="admin__header_text">{title}</div>
        <IoIosArrowDown className={"admin__header_arrow"+(open?"":" admin__header_arrow-hide")}/>
      </div>
      <div className={"admin__wrapper"+(!open?" admin__wrapper-hide":"")}>
        {open && children}
      </div>
    </section>
  );
}