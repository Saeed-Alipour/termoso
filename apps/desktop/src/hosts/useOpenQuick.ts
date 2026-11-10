import { useCallback } from "react";
import { useSnackbar } from "@/components/Snackbar";
import { useSaveHost } from "@/ipc/hooks";
import { errorMessage, type HostCard, type Uuid } from "@/ipc/types";
import { openTerminal } from "@/terminal/store";
import { quickHostForm, savedHostFor, type QuickTarget } from "./links";
import { tr } from "@/i18n";

/**
 * Connect to a typed `user@host:port` target. A host that is already saved
 * opens through its entry (so its keys and password apply). A new SSH target
 * connects as typed and a "Save host" action is offered in the notice; nothing
 * is written to the vault (and so synced) unless that is clicked.
 */
export function useOpenQuick(vaultId: Uuid | null, readOnly: boolean, hosts: HostCard[]) {
  const save = useSaveHost();
  const snackbar = useSnackbar();
  const { mutate } = save;
  return useCallback(
    (t: QuickTarget) => {
      const saved = savedHostFor(t, hosts);
      if (saved) {
        openTerminal({ kind: "host", host_id: saved.id, vault_id: saved.vaultId });
        return;
      }
      openTerminal(t);
      const form = vaultId && !readOnly ? quickHostForm(t, vaultId, null) : null;
      if (!form) return;
      snackbar.notify(tr("{label} is not in your hosts yet", { label: form.label }), "info", {
        label: tr("Save host"),
        onClick: () =>
          mutate(form, {
            onSuccess: () =>
              snackbar.notify(tr("Added {label} to your hosts", { label: form.label })),
            onError: (e) => snackbar.error(errorMessage(e)),
          }),
      });
    },
    [hosts, vaultId, readOnly, mutate, snackbar],
  );
}
