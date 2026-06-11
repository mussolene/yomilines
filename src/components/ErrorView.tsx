type ErrorViewProps = {
  message: string;
};

export function ErrorView({ message }: ErrorViewProps) {
  return (
    <p className="status status-error" role="alert">
      Error: {message}
    </p>
  );
}
