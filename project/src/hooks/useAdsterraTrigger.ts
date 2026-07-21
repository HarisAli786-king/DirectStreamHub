import { useEffect } from "react";

export function useAdsterraTrigger() {
  useEffect(() => {
    let triggered = false;
    const onClick = () => {
      if (triggered) return;
      triggered = true;
      document.body.dataset.adInteracted = "true";
      document.removeEventListener("click", onClick, true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}
