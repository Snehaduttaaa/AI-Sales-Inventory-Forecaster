interface DataStateProps {
  title: string;
  message: string;
}

export function DataState({ title, message }: DataStateProps) {
  return (
    <div className="data-state" role="status">
      <div className="data-state__indicator" />
      <h2 className="data-state__title">{title}</h2>
      <p className="data-state__message">{message}</p>
    </div>
  );
}
