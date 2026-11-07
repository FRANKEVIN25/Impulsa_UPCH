import { useEffect, useRef, useId } from "react";
import type { ReactNode } from "react";
import { X, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const asset = (name: string) =>
  `${import.meta.env.BASE_URL}assets/${name}`;
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-symbol">
        <img src={asset("a662a.png")} alt="" />
      </span>
      <strong>IMPULSA UPCH</strong>
    </span>
  );
}
export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const nav = useNavigate();
  return (
    <>
      <button className="back-link" onClick={() => nav("/app")}>
        <ArrowLeft size={17} /> Volver al inicio
      </button>
      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
    </>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement;
    dialog?.showModal();
    const cancel = (e: Event) => {
      e.preventDefault();
      close.current();
    };
    dialog?.addEventListener("cancel", cancel);
    return () => {
      dialog?.removeEventListener("cancel", cancel);
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Empty({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-symbol">✦</div>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action}
    </div>
  );
}
export function Toggle({
  label,
  detail,
  checked,
  onChange,
  icon,
}: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="setting-row">
      {icon && <span className="purple-icon">{icon}</span>}
      <div className="grow">
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </div>
      <button
        type="button"
        className={`toggle ${checked ? "on" : ""}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
      >
        <span>{checked ? "✓" : ""}</span>
      </button>
    </div>
  );
}
export function MenuRow({
  title,
  detail,
  icon,
  onClick,
}: {
  title: string;
  detail: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="setting-row row-button" onClick={onClick}>
      <span className="purple-icon">{icon}</span>
      <span className="grow">
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight size={18} />
    </button>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
