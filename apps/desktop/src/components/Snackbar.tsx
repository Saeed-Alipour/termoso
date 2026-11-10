import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Alert, Button, Snackbar, type AlertColor } from "@mui/material";
import { tr } from "@/i18n";

/** A button on the notice, e.g. "Save host"; clicking it dismisses the notice. */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  message: string;
  severity: AlertColor;
  action?: ToastAction;
}

interface SnackbarApi {
  notify: (message: string, severity?: AlertColor, action?: ToastAction) => void;
  error: (message: string) => void;
}

const Ctx = createContext<SnackbarApi | null>(null);

let mounted: ((message: string, severity: AlertColor, action?: ToastAction) => void) | null = null;

/** Show a toast from outside React (commands, event handlers). */
export function toast(message: string, severity: AlertColor = "success") {
  mounted?.(message, severity);
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Toast | null>(null);
  const notify = useCallback(
    (message: string, severity: AlertColor = "success", action?: ToastAction) => {
      setCurrent({ message, severity, action });
    },
    [],
  );
  useEffect(() => {
    mounted = notify;
    return () => {
      mounted = null;
    };
  }, [notify]);
  const api = useMemo<SnackbarApi>(() => ({ notify, error: (m) => notify(m, "error") }), [notify]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <Snackbar
        open={current !== null}
        autoHideDuration={current?.action ? 9000 : 4500}
        onClose={() => setCurrent(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={current?.severity ?? "info"}
          onClose={() => setCurrent(null)}
          action={
            current?.action ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  current.action?.onClick();
                  setCurrent(null);
                }}
              >
                {current.action.label}
              </Button>
            ) : undefined
          }
          sx={{ minWidth: 280 }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}

export function useSnackbar(): SnackbarApi {
  const api = useContext(Ctx);
  if (!api) throw new Error(tr("SnackbarProvider missing"));
  return api;
}
