import { useEffect, useRef } from "react";
import {
  type FieldValues,
  type Path,
  type UseFormSetValue,
  type Control,
  useWatch,
  type PathValue
} from "react-hook-form";

export function usePersistRHF<T extends FieldValues>(
    key: string,
    control: Control<T>,
    setValue: UseFormSetValue<T>,
    ready = true
  ) {
    const values = useWatch({ control });
    const hasRestored = useRef(false);
  
    // 🔁 Restore ONCE (after ready)
    useEffect(() => {
      if (!ready || hasRestored.current) return;
  
      const stored = localStorage.getItem(key);
      if (!stored) {
        hasRestored.current = true;
        return;
      }
  
      const parsed = JSON.parse(stored) as Partial<T>;
  
      (Object.keys(parsed) as Array<Path<T>>).forEach((name) => {
        const value = parsed[name];
        if (value !== undefined) {
          setValue(name, value as PathValue<T, typeof name>, {
            shouldDirty: false,
            shouldTouch: false
          });
        }
      });
  
      hasRestored.current = true;
    }, [key, ready, setValue]);
  
    // 💾 Persist ONLY after restore
    useEffect(() => {
      if (!hasRestored.current) return;
      localStorage.setItem(key, JSON.stringify(values));
    }, [key, values]);
  }
