"use client"

import { FloatingTranslator } from "@/components/floating-translator";

export default function Translator() {
  return (
    <div style={{width: "100%", height: "500px"}}>
      <FloatingTranslator pipWindow={window} onClose={() => {}} />
    </div>
  );
}




